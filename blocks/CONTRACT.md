# Block contract

Every page-builder block lives in `blocks/<kebab-name>/` and is self-contained:

| File | Exports | Notes |
|---|---|---|
| `schema.ts` | `schema` (defineType) | Already written for all blocks — do **not** change field names (types are generated from it). |
| `Component.tsx` | default `function XBlock(props: BlockProps<"xBlock">)` | Server component unless it needs state/motion → add `"use client"`. Receives `{ block, locale, pageId, index }` (+ `promoteFirstHeading` only for `portableTextBlock`). |
| `demo.ts` | `xDemo(input): BlockOf<"xBlock">` | Builds one block in the **resolved query shape** using helpers from `@/content/demo-helpers` (`img`, `captioned`, `pt`, `link`, `key`). Every field of the generated type must be present (`null` where empty). |

Types: `import type { BlockProps, BlockOf } from "@/blocks/types"` — derived from `sanity.types.ts` (generated; open it to see the exact shape of your block: search `_type: "xBlock"` inside `PAGE_BY_SLUG_QUERY_RESULT`).

Shared components/utilities:
- `@/components/SanityImage` — `<SanityImage image={block.image} alt="…" fill sizes="…" />` or with `width/height`. Returns null without asset.
- `@/sanity/lib/image` — `resolveImageUrl(image, {width,height})` when you need a raw URL (e.g. CSS background, canvas, `<img>` in a client viewer).
- `@/components/RichText` — `<RichText value={block.body} promoteFirstHeading />` renders `richText` Portable Text (wraps in `.prose-site`).
- `@/components/ActionLink` — `<ActionLink link={block.primaryCta} variant="primary|secondary|text" />` (null-safe).
- `@/components/SectionHeader` — `<SectionHeader eyebrow headline intro align="center" />`.
- `@/components/motion/Reveal` — client wrapper for whileInView fade/slide (`as="li"` etc.).
- `@/lib/motion` — `EASE_PRESENCE`, `DURATION_REVEAL` for `motion/react`.
- `@/lib/i18n` — `t(locale, key)` tiny UI dictionary; `Locale` type.
- `stegaClean` from `next-sanity` — **call it on any string used in logic** (`tone`, `level`, `variant`, comparisons, `switch`, className maps). Never on rendered copy.
- Demo products: `@/content/demo-products` exports `spektrum150`, `funktionPump`, `khManager` (`ProductSummary`), plus `demoProducts`.
- Placeholder images in `/public/images`: `hero-reef.jpg`, `spektrum-150.jpg`, `spektrum-150-detail.jpg`, `spektrum-150-mounted.jpg`, `funktion-pump.jpg`, `funktion-pump-detail.jpg`, `funktion-pump-lineup.jpg`, `kh-manager.jpg`, `kh-manager-detail.jpg`, `kh-manager-app.jpg`, `reef-before.jpg`, `reef-after.jpg`, `reef-corals.jpg`, `reef-fish.jpg`, `og-default.jpg`, `spektrum-spin-01.jpg` … `spektrum-spin-12.jpg`. Reference them as `img("spektrum-150.jpg")`.

Styling: **Tailwind 4 utilities only** inside components. Tokens available: colors `lime`, `lime-deep`, `ink`, `ink-soft`, `text`, `muted`, `paper`, `sand`, `sea`, `line`; fonts `font-sans`, `font-display`; classes `.page-gutter`, `.section-space`, `.container-site`, `.eyebrow`, `.prose-site`, `.on-dark` (put on dark sections so secondary/text ActionLinks invert). Section skeleton:

```tsx
<section className="section-space page-gutter">
  <div className="container-site">…</div>
</section>
```

Do **not** edit `app/globals.css`, `blocks/registry.tsx`, `blocks/schemas.ts`, `sanity/**`, or any file outside your block folders. If you truly need a keyframe, use Tailwind arbitrary values or `motion/react`.

Accessibility: semantic headings (h2 for section headline unless told otherwise), `aria-label`s on interactive controls, keyboard support for sliders/accordions/viewers, `useReducedMotion()` for motion, focus-visible rings (`focus-visible:outline-2 focus-visible:outline-lime`).

Contact form API contract (for `contactFormBlock`): `POST /api/contact` JSON `{ locale, name, company, email, phone, country, interest, message, website /*honeypot, must be empty*/, startedAt /*Date.now() when form mounted*/, pagePath }` → `200 {ok:true}` | `4xx/5xx {ok:false, error:string}`.
