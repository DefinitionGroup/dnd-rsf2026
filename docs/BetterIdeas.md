# Better Ideas — what changed vs. the Las Palmas codebase, and why

This project ports the Las Palmas Business Center page-builder pattern to a
multi-language landing-page generator for The Aquarium Solution. Three stack
upgrades were adopted on purpose. This document explains each in plain terms:
what it is, what problem it fixes, how it is wired here, and what you have to
remember day-to-day.

---

## 1. Sanity TypeGen — types generated from the schema and the queries

### The problem it fixes
Las Palmas kept a hand-written `types/content.ts` (250+ lines) that *described*
what Sanity returns. Nothing checked that it was true. Add a field in the schema,
forget the type, and the bug shows up in production as `undefined`. Blocks were
also typed against the *stored* shape, so every component had to know how the
GROQ projection reshaped things (e.g. `slug.current` → `slug`).

### What TypeGen does
`sanity schemas extract` reads `sanity.config.ts` and writes `schema.json`.
`sanity typegen generate` turns that plus every `defineQuery(...)` it finds into
`sanity.types.ts`:

- one TypeScript type per schema type (`Page`, `Product`, `HeroBlock`, …)
- one *result* type per query, named `<QUERY_NAME>_RESULT`, e.g.
  `PAGE_BY_SLUG_QUERY_RESULT` — the exact shape the projection returns,
  including `coalesce()`d locale strings, dereferenced products and resolved
  image assets.
- `overloadClientMethods: true` makes `sanityFetch({ query })` return the right
  type automatically.

### How it is wired here
- Config lives in `sanity.cli.ts` under `typegen` (the old `sanity-typegen.json`
  is deprecated). `path` is set explicitly because there is no `src/`.
- Scripts: `pnpm typegen` (also runs as `prebuild`), `pnpm typegen:watch`.
- `blocks/types.ts` derives everything components need from the generated
  result types: `PageDocument`, `PageBlock`, `BlockOf<"heroBlock">`,
  `ProductSummary`, `SiteShell`. **Components never import stored types.**
- `content/demo.ts` is typed against the same result types, so demo content
  can't drift from what the queries return.
- `sanity.types.ts` is committed (so CI/Vercel doesn't need to regenerate);
  `schema.json` is regenerated on every build.

### Day-to-day rules
1. Change a schema or a query → run `pnpm typegen` (or keep `typegen:watch`
   running). TypeScript then tells you every component/demo that must change.
2. Every query must be a **top-level, uniquely named** `defineQuery(...)`.
   Inline queries are invisible to TypeGen; duplicate names silently overwrite.
3. `--enforce-required-fields` turns `Rule.required()` into non-optional types.
   Drafts can still violate validation, so components stay null-tolerant.

---

## 2. Presentation tool + Visual Editing — click the page, edit the field

### The problem it fixes
Editing a landing page in a plain form is blind: you change a headline, save,
open the site in another tab, refresh, scroll. For a *page generator* the
feedback loop is the product. Las Palmas had no preview at all — the
"preview routes" were empty folders.

### What it does
The Studio gets a **Presentation** tab: the live Next.js site inside an iframe,
with an overlay. Click any text → the Studio opens that document at that field.
Drag blocks in the overlay → the `content[]` array reorders. Editing a draft
updates the iframe instantly (no publish needed).

Two mechanisms make that possible:

- **Stega**: when draft mode is on, `sanityFetch` embeds invisible metadata in
  every string (which document, which field path). The overlay reads it. This
  is why logic strings must be cleaned with `stegaClean()` before comparisons —
  `stegaClean(block.tone) === "ink"` — see `PageBuilder`, `ActionLink`, block
  components.
- **`data-sanity` attributes**: for non-text things (block wrapper, arrays)
  `createDataAttribute()` in `components/PageBuilder.tsx` tags each block with
  `id/type/path`, enabling click-to-select and drag-to-reorder.

### How it is wired here
| Piece | File |
|---|---|
| Presentation plugin + URL ↔ document mapping | `sanity.config.ts`, `sanity/presentation/resolve.ts` (`mainDocuments` for `/:locale` and `/:locale/:slug`; `locations` per type) |
| Draft-mode handshake | `app/api/draft-mode/enable/route.ts` (`defineEnableDraftMode`, verifies the Studio's secret with the Viewer token), `…/disable/route.ts` |
| Overlay + "Exit draft mode" pill | `app/(site)/[locale]/layout.tsx` renders `<VisualEditing/>` and `components/DisableDraftMode.tsx` only when draft mode is on |
| Studio embedded in Next | `app/(studio)/studio/[[...tool]]/page.tsx` (`NextStudio`, `force-static`, own route group so `SanityLive`/`VisualEditing` never render inside the Studio) |
| CORS with credentials | `http://localhost:3000` (+ every deploy origin) — `pnpm exec sanity cors add <origin> --credentials` |

### Day-to-day rules
1. `SANITY_API_READ_TOKEN` must be a **Viewer** token: it is handed to the
   browser in draft mode.
2. Any string that drives logic (`tone`, `level`, `variant`, `href` used in a
   comparison, className maps) → `stegaClean()`.
3. Never render stega'd strings into `<title>`, meta or JSON — metadata,
   `generateStaticParams`, sitemap use `stega: false` / `perspective: "published"`.
4. Keep the three contracts in sync when you change one: `previewMode.enable`
   path ↔ real route; `resolve` hrefs ↔ `[locale]/[slug]` routes; `stega.studioUrl`
   ↔ `/studio`.

---

## 3. `defineQuery` + Live Content API — typed queries, instant drafts, no ISR guessing

### The problem it fixes
Las Palmas fetched with `client.fetch(..., { next: { revalidate: 60, tags } })`
and hoped. Editors waited up to a minute (or hit a manual revalidate webhook)
and there was no draft preview at all. The fallback logic also *masked* real
404s: unknown slug → demo page, even in production.

### What it does
`defineLive({ client, serverToken, browserToken })` (in `sanity/lib/live.ts`)
returns:

- **`sanityFetch`** — reads `draftMode()` itself. Draft mode on → fetches the
  `drafts` perspective with stega; off → published, cached, and tagged with
  Sanity *sync tags*.
- **`<SanityLive/>`** — one component in the site layout. It subscribes to the
  Live Content API; when a document changes, Sanity tells the browser which
  sync tags are affected and Next revalidates exactly those fetches. Published
  changes appear in seconds without webhooks or `revalidate: 60`. In draft
  mode it streams draft edits live into the Presentation iframe.

### How it is wired here
- `sanity/lib/client.ts` — one always-constructed client (`stega.studioUrl:
  "/studio"`, `useCdn: true`, `perspective: "published"`).
- `sanity/lib/live.ts` — `defineLive`; `server-only`.
- `sanity/lib/loaders.ts` — the *only* place data is fetched. Rule: demo content
  **only when Sanity is not configured** (`isSanityConfigured === false`); when
  configured, a `null` result is a real `notFound()`.
- `cacheComponents` is left **off** for v1 (Next 16 default). If you later turn
  it on, `sanityFetch` must move to the documented three-layer pattern
  (`defineLive({ strict: true })`, `use cache`, perspective/stega passed as
  props) — see the Sanity "Cache Components" guide.
- `app/api/revalidate` remains as an optional manual hook; it is not needed for
  content updates anymore.

### Day-to-day rules
1. Fetch through `loaders.ts`, never `client.fetch` in a component.
2. Exactly one `<SanityLive/>` and one `<VisualEditing/>` in the tree.
3. `SANITY_API_READ_TOKEN` missing → published-only, no drafts, no error. Fine
   for a static preview, useless for editors — set it on Vercel too.

---

## Bonus: the block registry (why adding a block is one folder, not six files)

In Las Palmas a new block touched `schemaTypes/blocks/index.ts`, `page.ts`,
`types/content.ts`, `components/blocks/X.tsx`, `PageBuilder.tsx`,
`seed-sanity.ts` and (optionally) `queries.ts` and `demo.ts` — and three shipped
blocks had no demo entry at all.

Here a block is a folder `blocks/<name>/{schema.ts, Component.tsx, demo.ts}`,
listed **once** in `blocks/schemas.ts` (schema list) and `blocks/registry.tsx`
(component map). The page schema's `content[]`, the Studio schema, TypeGen, the
`PageBuilder` switch and the demo pages all derive from those two lists; the
`satisfies { [K in BlockType]: BlockComponent<K> }` check in the registry fails
the build if a schema exists without a component. See `blocks/CONTRACT.md`.

## Also worth knowing

- **Localization** uses two official plugins instead of a hand-typed
  `translationKey`: `@sanity/document-internationalization` v6 for `page`/`menu`
  (one document per language, localized slugs, editors get a "Translations"
  menu), and `sanity-plugin-internationalized-array` v5 for `product`/site
  settings (one document, per-language strings; queries `coalesce()` to the
  requested locale with an `en` fallback). Since March 2026 the language of an
  array item lives in a `language` field, not `_key` — all queries filter on
  `language == $locale`.
- **`en` fallback**: `/de/spektrum-150` serves the English document (with
  `noindex`) until a German page exists; once it does, the same URL redirects
  to the German page's localized slug.
- **No hard-fail on site origin**: `lib/site.ts` derives `SITE_ORIGIN` from
  `NEXT_PUBLIC_SITE_URL` with a placeholder default and never throws (the final
  `marketing.`/`landing.` domain is undecided).
