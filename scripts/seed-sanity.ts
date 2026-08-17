/**
 * Seed the Sanity dataset from the demo content.
 *
 *   pnpm sanity:seed          # uploads images + createOrReplace documents
 *   pnpm sanity:seed:dry      # prints the documents, no writes
 *
 * Runs via `sanity exec … --with-user-token` (CLI login), so no write token is
 * needed. Converts the *resolved* demo shapes back into stored document shapes:
 *   - demo image assets (url under /public/images) → uploaded image assets + refs
 *   - embedded products / testimonials → documents + references
 *   - locale-coalesced strings → internationalizedArray* values (en only)
 * Deterministic ids, so re-running is idempotent.
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, resolve } from "node:path";
import { getCliClient } from "sanity/cli";
import { demoPages, getDemoShell } from "../content/demo";
import { demoProducts } from "../content/demo-products";
import { apiVersion } from "../sanity/env";

const dryRun = process.argv.includes("--dry-run");
const client = getCliClient({ apiVersion });

type Doc = Record<string, unknown> & { _id: string; _type: string };
type AnyObj = Record<string, unknown>;

const isObj = (v: unknown): v is AnyObj => typeof v === "object" && v !== null && !Array.isArray(v);

/* ------------------------------------------------------------ helpers */

const i18n = (type: "String" | "Text" | "RichText", value: unknown) =>
  value == null ? undefined : [{ _key: "en", _type: `internationalizedArray${type}Value`, language: "en", value }];

const ref = (id: string) => ({ _type: "reference", _ref: id });

const assetIds = new Map<string, string>(); // local url → uploaded asset id
const imageUrls = new Set<string>();

function collectImages(node: unknown) {
  if (Array.isArray(node)) return node.forEach(collectImages);
  if (!isObj(node)) return;
  const asset = node.asset as AnyObj | undefined;
  if (isObj(asset) && typeof asset._id === "string" && asset._id.startsWith("demo-") && typeof asset.url === "string") {
    imageUrls.add(asset.url);
  }
  Object.values(node).forEach(collectImages);
}

/** Recursively converts resolved demo shapes into stored shapes. */
function toStored(node: unknown, ctx: { testimonials: Doc[] }): unknown {
  if (Array.isArray(node)) return node.map((n) => toStored(n, ctx)).filter((n) => n !== undefined);
  if (!isObj(node)) return node;

  // resolved image → image with asset reference
  const asset = node.asset as AnyObj | undefined;
  if (isObj(asset) && typeof asset._id === "string" && asset._id.startsWith("demo-")) {
    const id = assetIds.get(asset.url as string);
    if (!id) throw new Error(`No uploaded asset for ${asset.url}`);
    const { asset: _a, ...rest } = node;
    void _a;
    return { _type: "image", ...rest, asset: ref(id) };
  }
  // embedded product → reference
  if (typeof node._id === "string" && node._id.startsWith("demo-product-")) return ref(node._id as string);
  // resolved video (null in demos)
  const out: AnyObj = {};
  for (const [k, v] of Object.entries(node)) {
    if (v === null || v === undefined) continue;
    if (k === "groupId" || k === "translations" || k === "_updatedAt") continue;
    if (k === "testimonials" && Array.isArray(v) && node._type === "testimonialBlock") {
      out[k] = v.map((t, i) => {
        const tt = t as AnyObj;
        const id = `testimonial-en-${slugify(String(tt.name))}`;
        ctx.testimonials.push({ _id: id, _type: "testimonial", language: "en", quote: tt.quote, name: tt.name, role: tt.role ?? undefined, company: tt.company ?? undefined, approved: true });
        return { _key: `t${i}`, ...ref(id) };
      });
      continue;
    }
    if (k === "product" && isObj(v) && typeof v._id === "string") {
      out[k] = ref(v._id as string);
      continue;
    }
    out[k] = toStored(v, ctx);
  }
  // linkField objects in demo may lack _key inside arrays; Sanity requires _key on array members
  return out;
}

function withKeys(node: unknown, prefix = "k"): unknown {
  if (Array.isArray(node)) {
    return node.map((n, i) => {
      const inner = withKeys(n, `${prefix}${i}`);
      return isObj(inner) && !("_key" in inner) && "_type" in inner ? { _key: `${prefix}${i}`, ...inner } : inner;
    });
  }
  if (!isObj(node)) return node;
  return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, withKeys(v, `${prefix}-${k}`)]));
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ---------------------------------------------------------- documents */

function buildDocuments() {
  const testimonials: Doc[] = [];
  const ctx = { testimonials };

  const products: Doc[] = demoProducts.map((p) => ({
    _id: p._id,
    _type: "product",
    name: i18n("String", p.name),
    slug: { _type: "slug", current: p.slug },
    tagline: i18n("String", p.tagline),
    body: i18n("RichText", p.body),
    category: p.category ?? undefined,
    sku: p.sku ?? undefined,
    image: toStored(p.image, ctx),
    imageAlt: p.imageAlt ?? undefined,
    gallery: toStored(p.gallery, ctx),
    specs: (p.specs ?? []).map((s) => ({ _key: s._key, _type: "specRow", label: i18n("String", s.label), value: s.value, unit: s.unit ?? undefined })),
    legacyUrl: p.legacyUrl ?? undefined,
    manualUrl: p.manualUrl ?? undefined,
    videoUrl: p.videoUrl ?? undefined,
  }));

  const pages: Doc[] = demoPages.map((page) => {
    const { _id, title, slug, language, isHomepage, navbarVariant, metadata, product, content } = page;
    return {
      _id,
      _type: "page",
      title,
      language,
      slug: { _type: "slug", current: slug },
      isHomepage: isHomepage ?? false,
      navbarVariant: navbarVariant ?? "light",
      metadata: toStored(metadata, ctx),
      product: product ? ref(product._id) : undefined,
      content: withKeys(toStored(content, ctx), "c"),
    } as Doc;
  });

  const shell = getDemoShell("en");
  const settings: Doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    brandName: shell.settings?.brandName,
    description: i18n("Text", shell.settings?.description),
    email: shell.settings?.email ?? [],
    phone: shell.settings?.phone ?? [],
    legacySiteUrl: shell.settings?.legacySiteUrl,
    dealerLocatorUrl: shell.settings?.dealerLocatorUrl,
    socialLinks: withKeys(shell.settings?.socialLinks ?? [], "s"),
    defaultMetadata: toStored(shell.settings?.defaultMetadata, ctx),
  };
  const menu: Doc = {
    _id: "menu-en",
    _type: "menu",
    language: "en",
    items: withKeys(shell.menu?.items ?? [], "m"),
    cta: shell.menu?.cta ?? undefined,
    footerLinks: withKeys(shell.menu?.footerLinks ?? [], "f"),
  };

  const unique = new Map<string, Doc>();
  for (const d of [...products, ...testimonials, settings, menu, ...pages]) unique.set(d._id, d);
  return [...unique.values()];
}

/* --------------------------------------------------------------- main */

async function main() {
  collectImages([demoPages, demoProducts, getDemoShell("en")]);

  for (const url of imageUrls) {
    if (dryRun) {
      assetIds.set(url, `image-dryrun-${slugify(basename(url))}-1x1-jpg`);
      continue;
    }
    const filePath = resolve(process.cwd(), "public", url.replace(/^\//, ""));
    if (!existsSync(filePath)) throw new Error(`Missing local image: ${filePath} (run pnpm placeholders)`);
    const asset = await client.assets.upload("image", createReadStream(filePath), { filename: basename(filePath), label: "seed" });
    assetIds.set(url, asset._id);
    console.log(`asset  ${url} → ${asset._id}`);
  }

  const documents = buildDocuments();

  if (dryRun) {
    console.log(JSON.stringify(documents, null, 2));
    console.log(`\n[dry-run] ${documents.length} documents, ${imageUrls.size} images`);
    return;
  }

  const tx = client.transaction();
  for (const doc of documents) tx.createOrReplace(doc);
  const result = await tx.commit();
  console.log(`Committed ${documents.length} documents (transaction ${result.transactionId})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
