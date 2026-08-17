# Design system v3 — block restyle spec (Apple architecture, pinned by the brief)

Source style: refero.design/styles/apple — "a white room with a single blue switch". Here the switch is **lime**. Read `app/globals.css` (tokens + component classes) — use them, do not invent values. Be ruthless: every block must look like it came from the same page of apple.com.

## The rules (all binding)

- **Full-bleed, centered, stacked, symmetric.** No sidebars, no asymmetric splits by default. Section = `<section class="canvas-frost|canvas-white section-space page-gutter">` + `SectionHeader` (centered) + content in `container-site` (1200) / `container-text` (980 for copy). Alternate frost and white sections; **dark (`canvas-dark`) only for film/video sections** (and the 360° viewer).
- **Colour:** lime `bg-lime` ONLY as filled-pill fill and selected/active state (segmented control active, selected step). `text-lime-deep` only for outlined pills, inline links and ghost links. No lime text elsewhere, no lime borders, no lime figures. Everything else is carbon / ash / hairline / frost / white.
- **Type:** headings use the h-tags (Apple scale is on them) or `.display`/`.heading`/`.heading-sm`/`.subheading`. Section headline = `<h2>` (40/600). Tile titles = `h3` (28/600) or `h4` (21/600). Subheads / taglines = `.whisper` (300 weight). Body 17. Small = `.body-sm`, `.caption`, `.label`. Big numbers = `.figure` at `text-[56px]`/`display` size, weight 600, plus `.figure-unit`. Never weight 700 for headlines.
- **Shape:** pills 980 (`ActionLink`), cards/images/inputs **8px** (`.media`, `.tile`, `.card`, `.field`). **No shadows** anywhere except `.product-shadow` on a product cut-out. No blur/glass, no gradients, no glow, no rings.
- **Cards:** only as Apple "tiles" — `.tile` on a **white** section (tiles are frost) or white tiles on a frost section (`.canvas-frost .tile` is white automatically). Never a card inside a frost section that only holds text (the canvas is the surface). 24px padding, 12px element gap.
- **Photography first.** Product/feature images in `.media` at generous size; product cut-outs (PNG on white) with `object-contain` and optional `.product-shadow`. Do not crop cut-outs.
- **Icons:** minimal line SVG 1.5 stroke, grayscale (`text-ash`); never lime, never emoji.
- **Motion:** only `Reveal` (rise) or the block's own signature interaction. No entrance on hero.
- **No eyebrow above headings** (field feeds the product bar). No section numbers unless a real sequence (how-it-works keeps numbers).
- **Buttons:** primary filled lime + secondary outlined lime-deep, always paired when two; ghost text links with chevron.
- Keep every prop, behaviour, aria, keyboard path, stegaClean and payload exactly. Change markup/classes/layout only.

## Per-block briefs

- **intro**: `canvas-white`, `container-text` centered: `h2` then body paragraphs at `.lead`-ish? No — Apple: headline 40/600 centered + first paragraph as `.whisper` centered + remaining paragraphs 17px centered `text-ash`, all `max-w-[42rem] mx-auto`. RichText: pass `className="prose-site mx-auto text-center"` and let global styles apply.
- **portableText**: `canvas-white`, `container-prose`, left-aligned RichText (reading block).
- **featureList**: Apple "tile grid": `canvas-white`, 2-up (md) / 3-up (lg, when ≥6 items) grid of `.tile` (frost, 8px): `h4` title (21/600) + `.body-sm text-ash` text. Equal heights. No icons, no numbers.
- **splitContent**: Apple two-up "product tile" — `canvas-frost` section: a `container-site` grid of two halves: image in `.media aspect-[4/3]` and copy block vertically centered (`h3` 28/600, RichText body 17 `text-ash`, ghost link). `reverse` swaps. Tone maps: paper→`canvas-white`, sand→`canvas-frost`, ink→`canvas-dark`.
- **gallery**: `canvas-white`, `container-site`, 3-col grid of `.media aspect-square` (2-col on md), first spans 2 when count%3==1; caption `.caption` centered under each.
- **cta**: centered on `canvas-frost` (paper/lime tones → frost; ink → `canvas-dark`): `h2` + `.whisper` body + primary/secondary pills centered. No lime field.
- **statStrip**: `canvas-white`: row of 2–4 centered stats in a `container-site` grid, each = `.figure text-[clamp(2.5rem,4.6vw,3.5rem)] text-carbon` + `.figure-unit text-[21px] text-ash` + `.body-sm text-ash` label; hairline top/bottom on the row (`border-y hairline py-10`). Keep count-up. Tone ignored except ink→`canvas-dark`.
- **testimonial**: `canvas-frost`, tiles white (`.tile`), quote `.subheading` (21/400) carbon, name `.body-sm` carbon + role/company `.caption`; 1–3 columns.
- **productList**: Apple product grid: `canvas-frost`, tiles white (`.tile`, padding 24) with product image `.media aspect-square bg-white` (`object-contain`), name `h4` 21/600, tagline `.body-sm text-ash`, ghost link "Learn more ›" lime-deep. 2/3/4 columns; whole tile clickable; hover: none except link underline.
- **featureTour**: keep sticky mechanism; `canvas-white`; media `.media`; step titles `h3` 28/600 (active carbon, inactive `text-ash`); body 17 `text-ash`; stat `.figure text-[40px]` carbon + `.label`; rail = 1px hairline with a carbon active segment. Tone ink → `canvas-dark`.
- **howItWorks**: `canvas-frost`; steps list in a white `.tile` (this is a real object) with numbers `.body-sm text-ash`, titles `h4`, body `.body-sm text-ash`, progress hairline with **carbon** fill (not lime); image `.media`. Autoplay kept. Tone ink → `canvas-dark`.
- **beforeAfter**: `canvas-white`; `.media` frame; handle = 44px white circle with 1px hairline + two chevrons carbon; labels = white pills `.body-sm` with hairline; caption `.caption` centered.
- **productViewer**: `canvas-dark` (product on black, Apple film section); controls white pills, hint pill `bg-white/10`; dots ash; product name `h4` white, tagline `.body-sm text-mist`.
- **video**: `canvas-dark`; `.media aspect-video` in `container-site`; poster + white 72px play circle with carbon triangle; caption `.caption` centered.
- **comparisonTable**: Apple compare page: `canvas-white`, `container-site`; column headers stacked & centered: product image `.media aspect-square w-40 mx-auto` (object-contain, white), name `h4` centered, subtitle `.body-sm text-ash`, small filled pill only when `highlight` (label "Recommended" → use `.body-sm` lime-deep text, NOT a filled pill — filled = actions only); rows: hairline top, label `.body-sm text-ash` centered above value? Keep table semantics: first column labels left `.body-sm text-ash`, cells centered `body` carbon; check icons carbon 1.5 stroke; CTAs = ghost text links centered; footnote `.caption` centered.
- **faqSpec**: `canvas-frost`; spec table in white `.tile` (`h4` headline, hairline rows: label `.body-sm text-ash` / value 17 carbon `num`); FAQ list white `.tile` with hairline `<details>` rows, summary 17/600, plus/minus 1.5 stroke; downloads ghost links.
- **productFinder**: `canvas-white`; two white `.tile`s on… no: `canvas-frost` with two white tiles (inputs / result): slider track hairline with **carbon** fill and white thumb with hairline; segmented control = pill group `bg-pebble` with active `bg-white shadow-none` (selected state may use `bg-lime text-carbon` — that's the allowed selected use; choose lime); result: product image `.media`, `h4` title, `.figure text-[40px]` values, primary pill CTA; footnote `.caption`.
- **indicatorLegend**: `canvas-white`; device panel = `.tile` (frost) with the LED; list = hairline rows, name 17/600, severity chips `.caption` in `bg-pebble text-carbon` (alarm `bg-[#fde8e6] text-danger`), keep animations.
- **contactForm**: `canvas-frost`; form in a white `.tile` (max-w 640 centered): labels `.body-sm`, inputs `.field`, submit primary pill + dealer secondary pill; notices as `.body-sm` in the tile (no red stripes).
- **animatedHeadline**: `canvas-white`, centered `h2`/`h1` (`heading-lg` 44/400 for h2 — Apple's light large heading), keep word mask.

Finish: `pnpm exec tsc --noEmit` and `pnpm exec eslint <folders>` clean. Only your block folders.
