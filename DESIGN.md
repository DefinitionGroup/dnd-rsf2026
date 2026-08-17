---
name: D-D The Aquarium Solution — Product Stage
description: The category standard for aquarium hardware at Apple / Red Sea craft — one product on a stage, one idea per section, one action.
colors:
  lime: "#99cc33"
  lime-deep: "#6f9a1f"
  lime-soft: "#eef7dc"
  ink: "#1d1d1f"
  ink-soft: "#2c2c2e"
  stage: "#0b0b0c"
  stage-soft: "#161618"
  text: "#1d1d1f"
  muted: "#6e6e73"
  muted-dark: "#a1a1a6"
  paper: "#ffffff"
  sand: "#f5f5f7"
  line: "#d2d2d7"
  line-dark: "#3a3a3c"
  sea: "#0f4c5c"
  danger: "#d1352b"
  warn: "#e6a700"
typography:
  display-xl:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  display-lg:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  display-md:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.4vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"ss01\", \"cv05\""
  figure:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 78"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.45
  caption:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  nav:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  focus: "4px"
  logo: "7px"
  input: "0.75rem"
  card: "1.125rem"
  media: "1.25rem"
  pill: "980px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  section-y: "clamp(4.5rem, 9vw, 8.5rem)"
  section-y-sm: "calc(clamp(4.5rem, 9vw, 8.5rem) * 0.6)"
  header-h: "3rem"
  productbar-h: "3.25rem"
  card-pad: "1.75rem"
  card-pad-md: "2rem"
  header-to-body: "3rem"
  header-to-body-md: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1.25rem"
    typography: "0.95rem / 500"
  button-primary-hover:
    backgroundColor: "#a6d63f"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1.25rem"
    typography: "0.95rem / 500"
  button-secondary-hover:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.paper}"
  button-secondary-on-stage:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-secondary-on-stage-hover:
    backgroundColor: "#ededf0"
    textColor: "{colors.ink}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.lime-deep}"
    padding: "0"
    typography: "0.95rem / 500"
  button-text-on-stage:
    backgroundColor: "transparent"
    textColor: "{colors.lime}"
  button-header-cta:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.375rem 0.875rem"
    typography: "0.8rem / 500"
  card:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "1.75rem"
  card-on-stage:
    backgroundColor: "{colors.stage-soft}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "1.75rem"
  media:
    backgroundColor: "{colors.sand}"
    rounded: "{rounded.media}"
  media-on-stage:
    backgroundColor: "{colors.stage-soft}"
    rounded: "{rounded.media}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "0.75rem 1rem"
    typography: "1rem / 400"
  chip-recommended:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
    typography: "0.75rem / 500"
  chip-info:
    backgroundColor: "{colors.lime-soft}"
    textColor: "{colors.lime-deep}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
    typography: "0.75rem / 500"
  chip-warning:
    backgroundColor: "#fff4cc"
    textColor: "#7a5a00"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
    typography: "0.75rem / 500"
  chip-alarm:
    backgroundColor: "#fde8e6"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
    typography: "0.75rem / 500"
  header-bar:
    backgroundColor: "rgb(255 255 255 / 0.85)"
    textColor: "{colors.ink}"
    height: "{spacing.header-h}"
  product-bar:
    backgroundColor: "rgb(255 255 255 / 0.85)"
    textColor: "{colors.ink}"
    height: "{spacing.productbar-h}"
  footer:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
---

# Design System: D-D The Aquarium Solution — Product Stage

## Overview

**Creative North Star: "The Product Stage"**

This is the category standard for aquarium hardware, played straight at the craft level of apple.com and redseafish.com. Every section puts one product on a stage, states one idea, and offers one action. Colour is almost entirely withheld: white and sand grounds, a near-black stage where the product is the picture, ink text, and a single brand lime that appears only on primary pills, key measurement figures and active states. There is one type family (Archivo, with its width axis doing the work a second face would otherwise do), a generous vertical rhythm, and one authored motion — a rise-in on scroll — plus the signature interactions each instrument-like block owns (finder slider, feature-tour rail, before/after handle, LED legend).

Density is low and confident: headlines are short, sentence-case and tightly tracked; leads are one sentence; supporting copy sits in a muted grey at 17px. Structure comes from hairlines, tone changes (paper → sand → stage) and space, not from boxes. Cards exist only when they hold a real object (spec panel, calculator, result, testimonial). Depth is tonal, with a single soft shadow reserved for things that float (menus, the video play disc).

Confirmed rejections (from the direction contract, honoured by the build): no eyebrows or kickers above headings, no icon-card grids as page structure, no uppercase display type, no gradient text, no glass or glow decoration, no cream+serif editorial, no emoji or unicode glyph icons, no monospace as costume, no `border-left` accent bars.

**Key Characteristics:**
- Two grounds (paper / sand) and one near-black stage; lime is an accent, never a ground except for the CTA lime field.
- One family, Archivo variable width: normal width for reading, narrow heavy tabular figures for measurements.
- Section headline + lead, no eyebrow; the eyebrow field feeds the sticky product bar as the jump-link label instead.
- Pills for every action; text-variant links carry a chevron; external links carry an arrow.
- Hairlines (`#d2d2d7` on light, `#3a3a3c` on stage) separate; cards contain; shadows only float.
- One motion grammar: 640ms expo ease-out rise-in of 18px, staggered ≤ 80ms, visible by default without JS and under reduced motion. The hero has no entrance.

## Colors

A near-monochrome palette (white, sand, ink, near-black) with one binding brand accent, lime, rationed to actions and figures.

### Primary
- **Brand Lime** (`lime`): the binding D-D accent. Used for primary pills (ink text on lime), the header CTA, the logo mark tile, big measurement figures on the stage, the "Recommended" chip, active states (feature-tour progress segment, finder slider fill, sound-on indicator, active LED), the mobile stat-strip figures, and text selection. It is never body-text on white.
- **Lime Deep** (`lime-deep`): the AA-safe (4.6:1) lime for text on light grounds — text-variant links, prose links, figures on paper/sand, how-it-works step numbers, required-field asterisks, focus rings on light grounds.
- **Lime Soft** (`lime-soft`): the only tint; background of the "info / Normal" severity chip with lime-deep text.

### Neutral
- **Ink** (`ink`): headings and body text on light grounds; secondary pill background; text on lime.
- **Ink Soft** (`ink-soft`): secondary pill hover.
- **Text** (`text`): body copy (same value as ink; kept as a separate role token).
- **Muted** (`muted`): supporting copy, labels, captions, placeholders, inactive nav links on light grounds.
- **Muted Dark** (`muted-dark`): the same roles on the stage.
- **Paper** (`paper`): page ground, header/product-bar ground at 85% with backdrop blur, secondary pill on stage, headline colour on stage, play disc, before/after handle.
- **Sand** (`sand`): the second light ground (`stage-sand`), card fill, media placeholder, footer, comparison-table highlight column band, hover fill in the language menu.
- **Stage** (`stage`): the near-black product stage; hero, video, product viewer, feature tour, product finder, ink-tone stat strips and CTAs.
- **Stage Soft** (`stage-soft`): cards and media placeholders on the stage; device panel of the indicator legend.
- **Line / Line Dark** (`line`, `line-dark`): hairlines on light / stage; scrollbar thumb; input borders.

### Tertiary
- **Danger** (`danger`): alarm chip text and alarm LED only. **Warn** (`warn`) and **Sea** (`sea`) are declared in the theme; the build uses `warn` only for the warning LED and does not use `sea` in the sampled surface. Do not extend them into new roles without reason.

### Named Rules
**The Lime Discipline Rule.** Lime lives on the figures and the primary action, never on the ground and never as body text on white. On a lime field (CTA lime tone) the primary pill becomes the ink secondary pill and the second action becomes a text link, because a lime pill would vanish.

**The Two-Ground Rule.** Sections alternate paper and sand; the stage is used only where the product is the picture (hero, video, viewer, feature tour, finder instrument). Everything on a stage inherits its own vocabulary via `.stage`/`.on-dark`: headings go paper, muted goes muted-dark, hairlines go line-dark, cards and media go stage-soft, secondary pills go paper-on-ink, text links and focus rings go full lime.

## Typography

**Display Font:** Archivo (variable, `wdth` axis) with ui-sans-serif, system-ui, sans-serif
**Body Font:** Archivo (same face)
**Figure Font:** Archivo at width 78, weight 700, tabular lining numerals

**Character:** One family carries the whole system. Semibold sentence-case display with negative tracking gives the Apple-grade product voice; the narrow heavy tabular width for measurements is a nod to the brand's condensed heritage without introducing a second face. Body sits at 17px/1.55 with `ss01`, `cv05` on, `text-wrap: balance` on headings and `pretty` on paragraphs.

### Hierarchy
- **Display XL** (600, `clamp(2.75rem, 6vw, 5rem)`, 1.02, -0.03em): the hero h1 only, max-width 13ch, white on the stage.
- **Display LG** (600, `clamp(2.25rem, 4.6vw, 3.75rem)`, 1.06, -0.025em): section h2s (SectionHeader default, stat strip, CTA, animated headline), max-width 20ch.
- **Display MD** (600, `clamp(1.75rem, 3vw, 2.5rem)`, 1.12, -0.02em): split-content and intro headlines, feature-tour step titles, prose h2.
- **Title** (600, 1.25rem, 1.25): h4 and every in-block object title — feature-list statement, product tile name, comparison column name, spec panel heading, FAQ group heading, how-it-works step title.
- **Lead** (400, `clamp(1.125rem, 1.4vw, 1.375rem)`, 1.45, muted): the one-sentence intro under a headline, max-width 36rem; on stage it is muted-dark, in the hero it is paper at 85%.
- **Body** (400, 1.0625rem, 1.55): copy; `.prose-site` caps measure at 68ch with 1.6 leading.
- **Figure** (700, width 78, tabular, 0.95, -0.02em): big measurements — display-xl size in the stat strip, text-4xl/5xl in the finder result, text-5xl/6xl in the feature tour, text-lg for how-it-works step numbers. Units sit beside them in `figure-unit` (width 100, weight 500) at 0.4em of the figure.
- **Label** (500, 0.875rem, muted): stat labels, form labels, spec keys, column subtitles.
- **Caption** (400, 0.875rem, muted): footnotes, media captions, privacy notice, table hints.
- **Nav** (500, 0.8rem): header links, product-bar jump links, footer columns; 0.75rem for legal line and language toggle.

### Named Rules
**The No-Eyebrow Rule.** Nothing sits above a heading. The content model keeps an `eyebrow` field, but `SectionHeader` never renders it; PageBuilder uses it as the section's label in the sticky product bar (truncated at 28 characters). Headline + optional lead is the complete header.

**The Sentence-Case Rule.** No uppercase display or label type anywhere; tracking is negative on display and neutral on labels. Emphasis comes from weight (600) and size, not case.

**The Figure Rule.** Any number that is the point of a section is set as a `.figure` with a `.figure-unit` suffix and a `.label` beneath — never as ordinary bold body text. Numbers elsewhere (spec values, table cells) get `.num` for tabular alignment.

## Layout

Three container widths: **site** (1200px) for copy and most blocks, **wide** (1440px) for the header, hero, big media and the comparison table, **prose** (720px) for intro and rich-text blocks. Horizontal gutter is fluid (`clamp(1.25rem, 4vw, 3rem)`); vertical section rhythm is `clamp(4.5rem, 9vw, 8.5rem)` (72–136px) via `.section-space`, with a 0.6× variant. Section header to block body is 48px, 64px from `md`. Every section is `section-space page-gutter` + a container; a section is a full-width tone field, never a boxed card.

Grid grammar as built: split content is a 12-column grid with media 7 / copy 5 (reversible), media at 4:3; feature list is a two-column hairline statement list; stat strip is 2 columns on mobile up to 4–6 on desktop inside a `border-y` hairline band; FAQ/spec, contact and finder use a 5/7 split at `lg`; comparison table is a horizontally scrolling table with a sticky first column and 96px product thumbnails; footer is a 1.6fr/1fr/1fr/1fr grid on sand.

Chrome: a fixed 48px global bar (`--header-h`) that is transparent with paper text over a dark hero (`data-nav="light"` on `<html>`) and turns paper/85 with backdrop blur once scrolled past 8px, or is ink-on-paper with a `main` top offset on `data-nav="dark"` pages. Beneath it a sticky 52px product bar (`--productbar-h`) with page title, jump links (active link ink/medium, others muted), and one primary pill; jump targets scroll-margin the sum of both bars. Mobile: primary nav collapses under a two-line 18px hamburger into a paper drawer with hairline rows; product-bar links hide below `md`, the pill remains.

Breakpoints are Tailwind 4 defaults (sm 640, md 768, lg 1024). The hero is `min-h-[92svh]`, content bottom-left with `pt-40` and a fluid bottom pad.

## Elevation & Depth

Depth is tonal, not cast. Grounds step paper → sand → stage; objects on a ground step one tone (sand card on paper, stage-soft card on stage); separation is a 1px hairline. There is one shadow, `.elevated` (`0 12px 32px -12px rgb(0 0 0 / 0.18), 0 2px 6px -2px rgb(0 0 0 / 0.08)`), and it appears only on things that float over content: the language menu, the video play disc. The product bar gains a 1px `rgb(0 0 0 / 0.04)` underline once stuck. Translucent chrome (paper at 85% + `backdrop-blur-md`) is the header and product bar only — it is chrome behaviour, not decoration.

### Named Rules
**The Float-Only Shadow Rule.** `.elevated` is for menus and controls that hover above the page. Cards, media, sections and buttons carry no shadow at rest or on hover.

**The Hairline Rule.** Structure is drawn with 1px lines (`line` on light, `line-dark` on stage) — list rows, table rows, stat bands, footer legal line, FAQ details, spec rows. Never thicker, never coloured, never as a left accent bar.

## Shapes

Soft, product-photography radii on media and cards; full pills for anything you press. Media (images, video frames, before/after, viewer) is 20px (`--radius-media`) with `overflow: hidden` and a sand or stage-soft fill so it never flashes white. Cards are 18px (`--radius-card`). Inputs are 12px (`rounded-xl`) with a 1px hairline stroke. Actions, chips, segmented controls, hint pills, media labels and the header CTA are full pills (980px). The logo mark tile is a 7px rounded square. Focus rings are 2px lime-deep (lime on stage) with 3px offset and 4px radius. Icons are single-stroke SVGs at 1.5–1.6 stroke, 12px inside pills and 20px in tables (check, cross, chevron, external arrow, plus/minus, play triangle). No borders on cards; no outer card around tables; the comparison highlight is a sand column band, not a box.

## Components

### Buttons (ActionLink pills)
Character: quiet, confident, Apple-pill.
- **Shape:** full pill (980px), inline-flex, gap 8px, 0.95rem/500, padding 10px 20px, no underline; 200ms transition on colour, transform and shadow; `:active` nudges 1px down.
- **Primary:** lime ground, ink text; hover `#a6d63f`. Same on every ground (that is the brand binding), except inside a lime field where it is replaced by the secondary.
- **Secondary:** ink ground, paper text; hover ink-soft. On stage it inverts to paper ground, ink text; hover `#ededf0`.
- **Text:** no padding, lime-deep text with a 12px chevron; hover underline; on stage lime.
- **External links** get a 12px arrow icon and open in a new tab. Header CTA is a compact pill (0.8rem/500, 6px 14px). Product-bar pill is 0.85rem with 6px 16px.
- **Focus:** global 2px lime-deep / lime ring, 3px offset.

### Chips
- **Recommended:** lime ground, ink, 0.75rem/500, 2px 10px, pill; sits above the highlighted comparison column.
- **Severity (indicator legend):** info lime-soft/lime-deep, warning `#fff4cc`/`#7a5a00`, alarm `#fde8e6`/danger. Same pill geometry.
- **Media labels / hints:** paper at 90% with ink text on light media; paper at 10% with paper text on stage (viewer hint, finder segmented track).

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** sand on light grounds; stage-soft on stage (`.on-dark`/`.stage` context).
- **Shadow Strategy:** none.
- **Border:** none.
- **Internal Padding:** 28px, 32px from `md`.
- **Use only for real objects:** spec panel, calculator card and result card, testimonial, contact success/error notice, indicator device panel. Never nested; never as page-section wrapper.

### Media
20px radius, hidden overflow, sand/stage-soft placeholder fill; aspect 4:3 in split content, how-it-works and feature tour, 16:9 for video, square (96px) for comparison thumbnails. Product tiles hover-scale the image 1.02 over 400ms expo. Video play control is a 72px paper disc with a lime triangle, `.elevated`, scaling 1.05 on hover.

### Inputs / Fields
- **Style:** paper ground, 1px hairline, 12px radius, 12px 16px padding, 1rem ink text; label above in `.label`, required mark in lime-deep; select gets a muted chevron at right.
- **Focus:** border shifts to ink (200ms) plus the global lime-deep ring.
- **Disabled:** 60% opacity. Submit is the primary pill; success/error is an inline sand card, no coloured borders.
- **On stage (finder):** transparent ground, hairline (line-dark), paper text, `.num` for values; segmented control is a paper/10 pill track with a paper/ink active pill.

### Navigation
- **Global bar:** 48px, logo (lime 7px tile with narrow-width "D-D" + wordmark 0.95rem/600) left, 0.8rem/500 links at 90% opacity → 100% on hover, language toggle, lime CTA pill; transparent/paper text over hero, paper/85 blur + ink once scrolled. Mobile drawer: paper, 1.125rem/500 rows on hairlines, primary pill at the end.
- **Product bar:** sticky under the header, paper/85 blur, hairline bottom; title 1.05rem/600 -0.01em; jump links 0.8rem, active ink/500, rest muted → ink on hover; primary pill right.
- **Footer:** sand, four columns, 0.8rem column heads in 600, muted 0.8rem links → ink on hover, 0.75rem legal line above a hairline.

### Section Header (signature)
Headline (h2 by default, `display-lg`, or `display-md` at `size="md"`, max 20ch) + optional lead (max 36rem), inside a 46rem `.rise` header; left-aligned for editorial sections, centred for stage sections, stat strips and CTAs. No eyebrow, no number, no icon.

### Stat Strip (signature)
2–6 `.figure` measurements at display-xl size with `figure-unit` suffix and `.label` below, inside a hairline `border-y` band; lime-deep figures on paper (default), lime on stage, ink on sand. Numbers count up over 1.6s with an 80ms stagger once 60% in view; the author's exact string renders before hydration and under reduced motion.

### Motion grammar
One authored scroll motion: `.rise` → opacity 0 / translateY(18px) → visible over 640ms `cubic-bezier(0.16, 1, 0.3, 1)`, once, driven by a single IntersectionObserver (`-8%` bottom margin, 0.1 threshold); stagger via `transition-delay` in ≤ 80ms steps. Visible by default without JS (`html.js` gates the hidden state) and under `prefers-reduced-motion`. Signature interactions (feature-tour rail 500ms, FAQ plus/minus 300ms, hover 200–400ms) reuse the same expo ease. The hero has no entrance.

### Browser surface
`color-scheme: light`; scrollbar 10px, thumb `line` (→ `muted` on hover) with transparent track; `::selection` lime with ink text; smooth scrolling; text-size-adjust 100%.

## Do's and Don'ts

### Do:
- **Do** compose every section as `section-space page-gutter` + a container (`container-site` for copy, `container-wide` for big media/tables, `container-prose` for reading), on a tone field (`bg-paper`, `stage-sand`, or `.stage`).
- **Do** head a section with `SectionHeader` (headline + lead only) and let PageBuilder turn the block's `eyebrow` into the product-bar jump label.
- **Do** set every headline measurement as `.figure` + `.figure-unit` + `.label`, and every table/spec number with `.num`.
- **Do** use `.stage` only where the product is the picture (hero, video, viewer, feature tour, finder instrument) and rely on `.on-dark`/`.stage` cascades for stage colours rather than per-element overrides.
- **Do** keep lime to primary pills, key figures, active states and the Recommended chip; use `text-lime-deep` for any lime text on white.
- **Do** separate lists, rows and stat bands with 1px `.hairline`; reserve `.card` (sand / stage-soft, 18px, 28–32px pad) for real objects and `.media` (20px) for imagery.
- **Do** animate entrances only with `Reveal` (`.rise`, ≤ 80ms stagger) or the block's own signature interaction, and read easing/duration from the tokens (`--ease-out-expo`, `--duration-rise`).
- **Do** draw icons as single-stroke SVGs (1.5–1.6) reused from ActionLink / comparison-table styles.

### Don't:
- **Don't** render an eyebrow, kicker, section number or icon above a heading (how-it-works step numbers are the one exception because the sequence is information).
- **Don't** build feature sections as same-size icon + heading + text card grids; use the two-column hairline statement list.
- **Don't** set display or label type in uppercase, use gradient text, glass/blur decoration, glow, `border-l-4` accents, monospace as costume, or emoji/unicode icons.
- **Don't** put lime on a ground except the CTA lime field, and never pair a lime pill with a lime field.
- **Don't** add shadows to cards, media, sections or buttons; `.elevated` is for floating menus and controls only.
- **Don't** nest cards, wrap tables in an outer card, or box a section.
- **Don't** give the hero an entrance animation, add whileInView springs to every element, or exceed an 80ms stagger.
- **Don't** invent colours, radii or easings outside `app/globals.css` `@theme`.
