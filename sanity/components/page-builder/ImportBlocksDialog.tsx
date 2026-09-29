import { ArrowLeftIcon } from "@sanity/icons/ArrowLeft";
import { SearchIcon } from "@sanity/icons/Search";
import { Badge, Box, Button, Card, Checkbox, Dialog, Flex, Select, Spinner, Stack, Text, TextInput } from "@sanity/ui";
import { useEffect, useMemo, useState } from "react";
import { Preview, useClient, useCurrentUser, useSchema } from "sanity";
import { apiVersion, isStudioAdmin } from "@/sanity/env";
import {
  blockLabel,
  PAGE_BLOCKS_QUERY,
  PAGES_QUERY,
  type InsertPosition,
  type PageBlock,
  type PageSummary,
} from "./import-blocks";

type Props = {
  /** Published id of the page being edited — excluded from the source list. */
  currentId: string;
  /** Language of the page being edited — those pages are listed first. */
  language?: string;
  /** Blocks already on the page being edited, for the "insert after" choice. */
  targetBlocks: PageBlock[];
  /** Block types the target array accepts. */
  allowedTypes: string[];
  onImport: (blocks: PageBlock[], position: InsertPosition, source: PageSummary) => void;
  onClose: () => void;
};

export function ImportBlocksDialog({ currentId, language, targetBlocks, allowedTypes, onImport, onClose }: Props) {
  // `drafts` perspective: latest edits included, `_id` is always the published id.
  // Memoized — withConfig() returns a new client, which would re-run the fetch effects every render.
  const studioClient = useClient({ apiVersion });
  const client = useMemo(() => studioClient.withConfig({ perspective: "drafts" }), [studioClient]);
  const schema = useSchema();
  const admin = isStudioAdmin(useCurrentUser());

  const [pages, setPages] = useState<PageSummary[] | null>(null);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<PageSummary | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState<InsertPosition>("end");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .fetch<PageSummary[]>(PAGES_QUERY, { currentId, admin })
      .then(setPages)
      .catch((err: Error) => setError(err.message));
  }, [client, currentId, admin]);

  useEffect(() => {
    if (!source) return;
    let current = true;
    client
      .fetch<PageBlock[] | null>(PAGE_BLOCKS_QUERY, { id: source._id })
      .then((result) => {
        if (!current) return;
        const list = result ?? [];
        setBlocks(list);
        setSelected(new Set(list.filter((block) => allowedTypes.includes(block._type)).map((block) => block._key)));
      })
      .catch((err: Error) => current && setError(err.message));
    return () => {
      current = false;
    };
  }, [client, source, allowedTypes]);

  const visiblePages = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (pages ?? [])
      .filter((page) => !needle || `${page.title ?? ""} ${page.slug ?? ""}`.toLowerCase().includes(needle))
      .sort(
        (a, b) =>
          Number(b.language === language) - Number(a.language === language) ||
          (a.title ?? "").localeCompare(b.title ?? ""),
      );
  }, [pages, search, language]);

  const importable = (blocks ?? []).filter((block) => allowedTypes.includes(block._type));
  const chosen = importable.filter((block) => selected.has(block._key));
  const allChosen = importable.length > 0 && chosen.length === importable.length;

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  /** Pick a source page (or `null` to go back to the list); blocks load in the effect above. */
  const choose = (page: PageSummary | null) => {
    setSource(page);
    setBlocks(null);
    setSelected(new Set());
  };

  return (
    <Dialog
      id="import-page-blocks"
      width={2}
      onClose={onClose}
      header={source ? `Import from “${source.title ?? "Untitled"}”` : "Import blocks from another page"}
      footer={
        source && (
          <Flex gap={2} padding={3} align="center" wrap="wrap">
            <Button icon={ArrowLeftIcon} mode="bleed" text="Pages" onClick={() => choose(null)} />
            <Box flex={1} style={{ minWidth: 220 }}>
              <Select
                value={position}
                onChange={(event) => setPosition(event.currentTarget.value)}
                aria-label="Where to insert"
              >
                <option value="end">Insert at the end</option>
                <option value="start">Insert at the beginning</option>
                {targetBlocks.map((block, index) => (
                  <option key={block._key} value={block._key}>
                    Insert after {blockLabel(block, schema.get(block._type)?.title ?? block._type, index)}
                  </option>
                ))}
              </Select>
            </Box>
            <Button
              tone="primary"
              text={`Import ${chosen.length} block${chosen.length === 1 ? "" : "s"}`}
              disabled={chosen.length === 0}
              onClick={() => onImport(chosen, position, source)}
            />
          </Flex>
        )
      }
    >
      <Box padding={4}>
        {error ? (
          <Card tone="critical" padding={3} radius={2}>
            <Text size={1}>{error}</Text>
          </Card>
        ) : !source ? (
          <Stack gap={3}>
            <TextInput
              icon={SearchIcon}
              placeholder="Search pages by title or slug"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              autoFocus
            />
            {pages === null ? (
              <Flex justify="center" padding={4}>
                <Spinner muted />
              </Flex>
            ) : visiblePages.length === 0 ? (
              <Text size={1} muted>
                No other pages found.
              </Text>
            ) : (
              <Stack gap={1}>
                {visiblePages.map((page) => (
                  <Card
                    key={page._id}
                    as="button"
                    type="button"
                    padding={3}
                    radius={2}
                    disabled={page.blockCount === 0}
                    onClick={() => choose(page)}
                    style={{ textAlign: "left", width: "100%" }}
                  >
                    <Flex align="center" gap={3}>
                      <Stack flex={1} gap={2}>
                        <Text weight="medium">{page.title ?? "Untitled"}</Text>
                        {page.slug && (
                          <Text size={1} muted>
                            /{page.slug}
                          </Text>
                        )}
                      </Stack>
                      {page.language && (
                        <Badge tone={page.language === language ? "primary" : "default"}>
                          {page.language.toUpperCase()}
                        </Badge>
                      )}
                      <Text size={1} muted>
                        {page.blockCount} block{page.blockCount === 1 ? "" : "s"}
                      </Text>
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        ) : blocks === null ? (
          <Flex justify="center" padding={4}>
            <Spinner muted />
          </Flex>
        ) : (
          <Stack gap={3}>
            {source.language && language && source.language !== language && (
              <Card tone="caution" padding={3} radius={2}>
                <Text size={1}>
                  This page is in {source.language.toUpperCase()}, yours is in {language.toUpperCase()}. Imported
                  text stays in {source.language.toUpperCase()} until you translate it.
                </Text>
              </Card>
            )}
            <Flex as="label" align="center" gap={3} paddingX={1} style={{ cursor: "pointer" }}>
              <Checkbox
                checked={allChosen}
                indeterminate={chosen.length > 0 && !allChosen}
                onChange={() => setSelected(new Set(allChosen ? [] : importable.map((block) => block._key)))}
              />
              <Text size={1} weight="medium">
                Select all ({importable.length})
              </Text>
            </Flex>
            <Stack gap={2}>
              {blocks.map((block) => {
                const schemaType = schema.get(block._type);
                const allowed = allowedTypes.includes(block._type) && Boolean(schemaType);
                return (
                  <Card key={block._key} border radius={2} padding={1} tone={allowed ? "default" : "transparent"}>
                    <Flex as="label" align="center" gap={3} paddingLeft={2} style={{ cursor: allowed ? "pointer" : "default" }}>
                      <Checkbox
                        checked={allowed && selected.has(block._key)}
                        disabled={!allowed}
                        onChange={() => toggle(block._key)}
                      />
                      <Box flex={1}>
                        {schemaType ? (
                          <Preview schemaType={schemaType} value={block} layout="default" />
                        ) : (
                          <Box padding={2}>
                            <Text size={1} muted>
                              Unknown block type “{block._type}” — cannot be imported
                            </Text>
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </Card>
                );
              })}
            </Stack>
          </Stack>
        )}
      </Box>
    </Dialog>
  );
}
