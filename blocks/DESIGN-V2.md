# Design system v2 — block restyle spec ("product stage")

Direction: the category standard for aquarium hardware executed at **Apple / Red Sea craft**. Restrained colour, one type family, generous rhythm, product imagery on white or near-black stages, one authored motion. Read `app/globals.css` for the tokens — use them, do not invent colours/radii/easings.

## Non-negotiables

- **No eyebrow above headings.** The `eyebrow` field is *not rendered* in blocks (it now labels the sticky product bar). `SectionHeader` ignores it — just pass headline/intro. Delete any `<p className="eyebrow">`.
- **No section numbers** (01/02/03) unless the sequence is information (how-it-works steps *are* a sequence → keep numbers there; feature list is not).
- **No same-size icon+heading+text card grids as page structure.** Feature lists become a two-column *statement list* (Apple "tile" grammar: big statement, one line of support) or a hairline-separated list.
- No uppercase display type. Sentence case, `display-lg`/`display-md`, tight tracking is already in the h-tags.
- No gradient text, no glass/blur decoration, no glow, no `border-l-4` accents, no monospace as costume, no emoji/unicode icons (draw SVG icons in one stroke weight 1.5, or reuse the chevron/check style from `ActionLink`/`comparison-table`).
- Motion: only `Reveal` (rise-in, `as="li"|"figure"|"div"`, small `delay` stagger ≤ 80ms per item) or the block's own *signature* interaction (viewer, slider, stepper, finder, legend). No whileInView springs on every element; hero has no entrance.
- Colour: light grounds by default (`bg-paper` / `stage-sand`). Use `.stage` (near-black) only where the product is the picture: hero, video, 360° viewer, feature tour, before/after may stay light. Lime = primary pills + key figures + active states, never for body text on white (use `text-lime-deep` for text).
- Type roles: `.display-lg` section headlines, `.lead` intros, `.figure` + `.figure-unit` for big measurements (tabular, narrow width), `.label` for small labels, `.caption` for captions. Body 17px.
- Layout: `section-space page-gutter` + `container-site` (1200) for copy, `container-wide` (1440) for big media/tables. Headline blocks max-width via `SectionHeader` (34ch), align `center` for stage sections and stat/CTA, `left` for editorial sections.
- Cards only when they hold a real object (product, testimonial, spec panel): `.card` (sand or stage-soft, radius-card), padding 28–32px, no nested cards. Media: `.media` (radius-media). Elevation only on floating things (`.elevated`).
- Focus rings, selection, tabular numerals are global — don't override.
- Accessibility and behaviour of every block must stay identical (same props, same interactions, same aria).

## Per-block briefs

- **intro**: single column, `container-prose`, headline `display-md`, body via RichText `.prose-site`. Left aligned. Optional: first paragraph as `.lead`.
- **portableText**: `container-prose`, RichText only.
- **featureList**: two-column statement list on `stage-sand`: each item = `<h3 class="text-xl font-semibold">` + one support line `text-muted`; items separated by hairlines (`border-t hairline`) not cards; no numbers. Reveal per `li`.
- **splitContent**: 12-col grid, media 7 / copy 5 (or reversed), image in `.media` aspect 4:3, copy vertically centred, headline `display-md`, RichText, text-variant ActionLink. Tone paper / sand / ink → `bg-paper` / `stage-sand` / `stage`.
- **gallery**: masonry-ish 2-col with the first image spanning (already) — keep, but `.media`, captions as `.caption` under image, no numbering.
- **cta**: centred statement on `stage` (ink) or `stage-sand` (paper) or a lime field (`bg-lime text-ink`, use secondary ink pill + text link). Headline `display-lg`, body `.lead`, pills.
- **statStrip**: Apple-style "numbers that matter": each stat = `.figure` (display-xl size) + `.figure-unit` suffix + `.label` under; 2–4 across; hairline between on desktop; on `stage-sand` by default (lime tone → lime field with ink text; ink → `stage`). Keep count-up.
- **testimonial**: sand cards with the quote as `text-xl` and attribution `.label`; 1–3 columns; no quotation-mark glyph decoration.
- **productList**: product tiles like a store grid: `.media` image square-ish on sand, name `text-xl font-semibold`, tagline `text-muted`, text-variant link "Learn more". 2/3/4 columns. Whole tile clickable, subtle hover (image scale 1.02, 400ms expo).
- **featureTour**: keep the sticky-media mechanism; on `stage`; step titles `display-md`, active step white, inactive `text-muted-dark`; the progress rail becomes a 1px hairline with a lime segment; stat/statLabel use `.figure`/`.label`. Mobile: image + copy stacked per step.
- **howItWorks**: keep autoplay stepper. Left steps list with numbers (this is a sequence): number in `.figure` small (text-lg) lime-deep, title `text-xl font-semibold`, body `text-muted`; progress track hairline with lime fill; right image `.media`. Light ground.
- **beforeAfter**: `.media` container, handle = 44px white circle with two chevrons (SVG), labels as small pills (`bg-paper/90 text-ink`), caption `.caption`.
- **productViewer**: `stage`; hint pill `bg-paper/10 text-paper`; controls (+/−/reset) as small ink-on-white pills; progress dots subtle; product name/tagline below in white/muted-dark.
- **video**: `.media` 16:9 in `container-wide` on `stage`; play button = white circle 72px with lime triangle SVG; caption `.caption`.
- **comparisonTable**: Apple compare grammar: no outer card; column headers with product image (`.media` square 96px) + name `text-xl font-semibold` + subtitle `.label`; highlight column = `bg-sand` column band + small lime pill "Recommended"; rows hairline; check/cross icons ink; CTAs as text-variant links; footnote `.caption`.
- **faqSpec**: spec table = hairline rows in a `.card` sand panel with label `.label` / value `font-medium num`; FAQ = hairline-separated `<details>` with `text-lg font-medium` summary and a plus/minus SVG that rotates; downloads as text links.
- **productFinder**: light card on `stage-sand` or `stage` (keep dark, it's the calculator "instrument"): slider track hairline with lime fill; segmented control = pill group (`bg-paper/10`, active `bg-paper text-ink`); result card `.card` with `.figure` for flow and roll weeks; CTA primary pill.
- **indicatorLegend**: device panel = `.card` in `stage-soft` with rounded LED; list = hairline rows; severity chips: info `bg-lime-soft text-lime-deep`, warning `bg-[#fff4cc] text-[#7a5a00]`, alarm `bg-[#fde8e6] text-danger`; keep animation.
- **contactForm**: form fields = `rounded-xl border hairline bg-paper px-4 py-3` with `focus-visible` ring, labels `.label` above; submit primary pill; dealer CTA secondary; success/error as inline notice (`.card` sand, no red border-left).
- **animatedHeadline**: keep word-mask; headline `display-lg` sentence case, `container-site`, left aligned; no eyebrow.

When done: `pnpm exec tsc --noEmit` + `pnpm exec eslint <your folders>` clean. Do not touch files outside your block folders.
