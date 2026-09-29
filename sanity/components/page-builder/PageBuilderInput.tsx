import { DownloadIcon } from "@sanity/icons/Download";
import { Button, Stack } from "@sanity/ui";
import { useToast } from "@sanity/ui/toast";
import { useCallback, useMemo, useState } from "react";
import { useFormValue, type ArrayOfObjectsInputProps } from "sanity";
import { ImportBlocksDialog } from "./ImportBlocksDialog";
import { cloneForImport, insertPatches, publishedIdOf, type InsertPosition, type PageBlock, type PageSummary } from "./import-blocks";

/**
 * The default page-builder array input plus an "Import blocks from another page"
 * button. Reads the source page straight from the Content Lake — no system
 * clipboard involved, so it works inside the Sanity Dashboard iframe and in every browser.
 */
export function PageBuilderInput(props: ArrayOfObjectsInputProps) {
  const { onChange, readOnly, schemaType, value } = props;
  const documentId = useFormValue(["_id"]) as string | undefined;
  const language = useFormValue(["language"]) as string | undefined;
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const allowedTypes = useMemo(() => schemaType.of.map((type) => type.name), [schemaType]);

  const handleImport = useCallback(
    (blocks: PageBlock[], position: InsertPosition, source: PageSummary) => {
      onChange(insertPatches(cloneForImport(blocks), position));
      setOpen(false);
      toast.push({
        status: "success",
        title: `Imported ${blocks.length} block${blocks.length === 1 ? "" : "s"}`,
        description: `From “${source.title ?? "Untitled"}”`,
      });
    },
    [onChange, toast],
  );

  return (
    <Stack gap={3}>
      {props.renderDefault(props)}
      {!readOnly && (
        <Button
          icon={DownloadIcon}
          mode="ghost"
          text="Import blocks from another page"
          onClick={() => setOpen(true)}
        />
      )}
      {open && (
        <ImportBlocksDialog
          currentId={publishedIdOf(documentId)}
          language={language}
          targetBlocks={(value ?? []) as PageBlock[]}
          allowedTypes={allowedTypes}
          onImport={handleImport}
          onClose={() => setOpen(false)}
        />
      )}
    </Stack>
  );
}
