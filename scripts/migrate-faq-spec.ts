/**
 * One-off migration: split every faqSpecBlock in page.content into
 * specsBlock + faqBlock at the same position. Run:
 *   sanity exec <this file> --with-user-token [-- --dry-run]
 */
import { getCliClient } from "sanity/cli";

const dryRun = process.argv.includes("--dry-run");
const client = getCliClient({ apiVersion: "2026-07-14" });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>;

function splitBlock(old: AnyObj): AnyObj[] {
  const out: AnyObj[] = [];
  const showSpecs = old.showSpecs !== false;
  if (showSpecs && (old.product || (old.downloads ?? []).length > 0)) {
    out.push({
      _type: "specsBlock",
      _key: `${old._key}-specs`,
      ...(old.eyebrow ? { eyebrow: old.eyebrow } : {}),
      headline: old.specsHeadline ?? "Technical specifications",
      ...(old.product ? { product: old.product } : {}),
      ...(old.downloads?.length ? { downloads: old.downloads } : {}),
    });
  }
  if ((old.faqs ?? []).length > 0) {
    out.push({
      _type: "faqBlock",
      _key: `${old._key}-faq`,
      headline: old.faqHeadline ?? "Frequently asked questions",
      faqs: old.faqs,
    });
  }
  return out;
}

async function main() {
  const docs: AnyObj[] = await client.fetch(
    `*[_type == "page" && count(content[_type == "faqSpecBlock"]) > 0]{_id, "slug": slug.current, content}`,
  );
  if (docs.length === 0) {
    console.log("No documents with faqSpecBlock found.");
    return;
  }
  const tx = client.transaction();
  for (const doc of docs) {
    const content = (doc.content as AnyObj[]).flatMap((b) => (b._type === "faqSpecBlock" ? splitBlock(b) : [b]));
    console.log(`${doc._id} (${doc.slug}): ${doc.content.length} -> ${content.length} blocks`);
    if (dryRun) {
      console.log(JSON.stringify(content.filter((b) => b._type === "specsBlock" || b._type === "faqBlock").map((b) => ({ _type: b._type, _key: b._key, headline: b.headline })), null, 2));
      continue;
    }
    tx.patch(doc._id, (p) => p.set({ content }));
  }
  if (dryRun) {
    console.log(`[dry-run] would patch ${docs.length} documents`);
    return;
  }
  const result = await tx.commit();
  console.log(`Patched ${docs.length} documents (transaction ${result.transactionId})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
