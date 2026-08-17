---
name: D-D The Aquarium Solution — ClariSea (v3)
description: A white room with a single lime switch — the Apple design architecture applied to aquarium hardware; photography of the product is the design.
colors:
  lime: "#99cc33"
  lime-deep: "#6f9a1f"
  lime-signal: "#b9dd6b"
  onyx: "#000000"
  carbon: "#1d1d1f"
  smoke: "#333333"
  graphite: "#474747"
  ash: "#6e6e73"
  mist: "#86868b"
  pebble: "#e8e8ed"
  hairline: "#d2d2d7"
  line-dark: "#424245"
  frost: "#f5f5f7"
  white: "#ffffff"
  danger: "#d1352b"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: "0.011em"
  heading:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: "0.011em"
  heading-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "0.007em"
  subheading:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: 1.24
    letterSpacing: "-0.005em"
  whisper:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "clamp(1.3125rem, 1.9vw, 1.625rem)"
    fontWeight: 300
    lineHeight: 1.24
    letterSpacing: "0.004em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: "-0.016em"
  body-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: "-0.016em"
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "-0.01em"
  nav:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0"
    fontVariation: "tabular-nums lining-nums"
rounded:
  media: "8px"
  card: "8px"
  input: "8px"
  pill: "980px"
spacing:
  tile-pad: "24px"
  tile-gap: "12px"
  section-y: "clamp(4rem, 8vw, 7rem)"
  section-y-sm: "calc(clamp(4rem, 8vw, 7rem) * 0.6)"
  gutter: "clamp(1.25rem, 4vw, 2.75rem)"
  header-h: "44px"
  productbar-h: "52px"
  container-page: "1440px"
  container-site: "1200px"
  container-text: "980px"
  container-prose: "720px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.carbon}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "11px 15px"
  button-primary-hover:
    backgroundColor: "#a3d63f"
    textColor: "{colors.carbon}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.lime-deep}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "11px 15px"
  button-secondary-hover:
    backgroundColor: "{colors.lime-deep}"
    textColor: "{colors.white}"
  button-secondary-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.lime}"
    rounded: "{rounded.pill}"
    padding: "11px 15px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.lime-deep}"
    typography: "{typography.body}"
    padding: "0"
  button-small:
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  tile:
    backgroundColor: "{colors.frost}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.card}"
    padding: "{spacing.tile-pad}"
  tile-on-frost:
    backgroundColor: "{colors.white}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.card}"
    padding: "{spacing.tile-pad}"
  tile-on-dark:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.frost}"
    rounded: "{rounded.card}"
    padding: "{spacing.tile-pad}"
  media:
    backgroundColor: "{colors.frost}"
    rounded: "{rounded.media}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.carbon}"
    typography: "{typography.body}"
    rounded: "{rounded.input}"
    padding: "12px 14px"
  segmented-control:
    backgroundColor: "{colors.pebble}"
    textColor: "{colors.ash}"
    rounded: "{rounded.pill}"
    padding: "4px"
  segmented-control-selected:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  global-nav:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.white}"
    typography: "{typography.nav}"
    height: "{spacing.header-h}"
  product-bar:
    backgroundColor: "{colors.white}"
    textColor: "{colors.graphite}"
    typography: "{typography.nav}"
    height: "{spacing.productbar-h}"
  severity-chip:
    backgroundColor: "{colors.pebble}"
    textColor: "{colors.carbon}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  severity-chip-alarm:
    backgroundColor: "#fde8e6"
    textColor: "{colors.danger}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: D-D The Aquarium Solution — ClariSea (v3)

## Overview

**Creative North Star: "A White Room With a Single Lime Switch"**

This is the Apple design architecture (Refero "Apple") translated for reef-keeping hardware. The page is a sequence of full-bleed, centered, stacked, symmetric sections on two canvases, frost and white, alternating as the story moves; the only dark surfaces are the 44px global nav and the film/360° sections. Every section opens with a centered headline and, optionally, a light 300-weight "whisper" tagline; below it sits the thing itself, a photograph or product cut-out from the client's original studio photography, on white. Copy is carbon on light, ash for the supporting voice, and it stays inside a 980px column. There are no decorative colours, no gradients, no glass, no glow, and exactly one shadow (a soft drop shadow reserved for product cut-outs).

Colour is a switch, not a palette. Lime (#99cc33) appears only where the user can act or has chosen: the filled pill and the selected state of a segmented control. Lime-deep (#6f9a1f), which passes AA on white, draws outlined pills, ghost links, focus rings and prose links. Nothing else, no border, figure, icon or heading, is coloured. Numbers are big and tabular in carbon; icons are 1.5-stroke grayscale line SVGs; progress and slider fills are carbon on hairline. Type is SF Pro on Apple devices and Inter everywhere else, on a major-second scale from 17px with Apple's slightly positive tracking on large sizes and slightly negative tracking on body.

The system rejects the previous v2 world explicitly: no dark product stages behind copy, no card grids sitting on the canvas for text alone, no eyebrows or kickers over headings, no second accent, no 700-weight headlines, no shipped display face.

**Key Characteristics:**
- Two light canvases (frost #f5f5f7 / white) alternating; dark (#000 / #1d1d1f) only for global nav and film sections.
- One accent with two jobs: lime fills the primary pill and the selected state; lime-deep outlines, links, and focus rings.
- Photography-led: the product render/photograph is the hero of every section; cut-outs sit on white, uncropped, `object-contain`.
- Apple type scale from 17px, weight 600 for headings, 300 for the whisper tagline, never 700.
- Two-tier navigation: 44px carbon global nav with the real D-D wordmark, 52px sticky white product bar generated from block eyebrows.
- Pills 980px, everything else 8px; hairlines #d2d2d7; one product-image shadow; a single rise-in scroll motion.

## Colors

A near-monochrome Apple neutral ramp with a single lime switch; the ramp itself is the palette.

### Primary
- **Lime** (#99cc33): the accent's only home. Filled primary pill fill (carbon text), the selected segment of a segmented control, the success mark in the contact form, text-selection highlight, and the outlined/ghost action colour when it sits on a dark canvas. Hover lightens to #a3d63f. Never text, borders, figures or icons on light canvases.
- **Lime Deep** (#6f9a1f): the AA-on-white companion. Outlined secondary pill border and text, ghost text-link colour, prose links, `:focus-visible` outline. Hover on the outlined pill fills it lime-deep with white text.
- **Lime Signal** (#b9dd6b): declared for rare decorative strokes/image outlines; not used on the built page.

### Neutral
- **Onyx** (#000000): the film/360° canvas (`.canvas-dark`) and the mobile nav sheet is carbon; text on onyx is frost.
- **Carbon** (#1d1d1f): all headings and primary text on light; the global nav bar; tiles and `.media` grounds on dark canvases; slider/progress fills; icons that are "on".
- **Smoke** (#333333): declared secondary text; rarely used.
- **Graphite** (#474747): product-bar jump links at rest (carbon when active).
- **Ash** (#6e6e73): supporting body, tile body, table labels, captions, `.lead`, placeholders, inactive tour steps, icon strokes.
- **Mist** (#86868b): ash's role on dark canvases (`.lead`, `.caption`, `.label`, stat units).
- **Pebble** (#e8e8ed): segmented-control track, severity chips, disabled fills.
- **Hairline** (#d2d2d7): every rule and border on light: table rows, stat-strip top/bottom rules, tour rail, slider track, thumb border, before/after handle border, product-bar underline, footer dividers, scrollbar thumb.
- **Line Dark** (#424245): the hairline on dark canvases.
- **Frost** (#f5f5f7): the primary canvas; also the ground of tiles and `.media` on white sections; the footer canvas.
- **White** (#ffffff): the alternate canvas; the hero canvas; product bar; tiles and `.media` on frost sections; pill labels and the before/after handle.
- **Danger** (#d1352b): alarm severity text in the indicator legend only (on #fde8e6).

### Named Rules
**The Single Switch Rule.** Lime is a fill, never a stroke or a glyph. It may only fill the primary pill and the selected state; lime-deep may only draw an outline, a link, or a focus ring. Everything else is carbon, ash, hairline, frost or white.

**The Two Canvases Rule.** Sections alternate frost and white; the hero is white and the first frost canvas begins with the next section. Dark canvases are for the global nav, the film section and the 360° viewer only, never as a product stage behind copy.

**The Carbon Fill Rule.** Progress rails, slider fills, active tour segments and how-it-works progress use carbon (white on dark), not lime. Selection is lime; progress is carbon.

## Typography

**Display Font:** SF Pro Display via `-apple-system` / `BlinkMacSystemFont` (with Inter, then Helvetica Neue)
**Body Font:** SF Pro Text via the system stack (with Inter, then Helvetica Neue)
**Label/Mono Font:** none; figures use tabular lining numerals of the same family (`.figure`, `.num`)

**Character:** Apple's own voice: confident 600-weight headings with a hair of positive tracking, a light 300-weight tagline that whispers under them, and a compact 17px body with negative tracking. No display face is shipped; Inter (weights 300–700, `--font-inter`) is only the fallback for non-Apple platforms.

### Hierarchy
- **Display** (600, clamp(2.5rem, 4.6vw, 3.5rem) ≈ 40–56px, 1.07, +0.011em): the hero `h1`, centered, `max-w-[18ch]`, `text-wrap: balance`.
- **Heading** (600, clamp(2rem, 3.4vw, 2.5rem) ≈ 32–40px, 1.14, +0.011em): every section `h2` via `SectionHeader`, centered, `max-w-[24ch]`. `.heading-lg` (400, up to 44px) exists for the animated headline's light large heading.
- **Heading-sm** (600, 28px, 1.18, +0.007em): `h3`, split-content and feature-tour step titles.
- **Subheading** (600, 21px, 1.24, −0.005em): `h4` tile titles, product-bar title, comparison column names, FAQ/spec headlines. `.subheading` (400) is the testimonial quote voice.
- **Whisper** (300, clamp(21px, 1.9vw, 26px), 1.24, +0.004em): the tagline under headlines and the CTA body; carbon on light; `max-w-[42rem]`.
- **Body** (400, 17px, 1.47, −0.016em): default; supporting copy takes `text-ash`; prose measure 68ch.
- **Body-sm** (400, 14px, 1.29, −0.016em): tile body, table labels and cells, form labels, step numbers, pill labels inside media, small pill.
- **Caption** (400, 12px, 1.33, −0.01em, ash): image captions, footnotes, slider min/max, severity chips, footer.
- **Nav** (400, 12px, −0.01em): global-nav links (white/80 → white) and product-bar jump links (graphite → carbon).
- **Figure** (600, 40px or display size, 1, tabular): big numbers in stat strip, feature tour and product finder; units in `.figure-unit` (400, 17–21px, ash).

### Named Rules
**The No-Eyebrow Rule.** Nothing sits above a heading. `SectionHeader` accepts `eyebrow` but never renders it; the field feeds the product bar's jump-link label instead. No kickers, no section numbers except in a real sequence (how-it-works keeps its numbers).

**The 600 Ceiling Rule.** Headings are weight 600 and never 700; the tagline is 300; body is 400. Emphasis comes from size and canvas, not weight.

**The Center Column Rule.** Headline + whisper are centered in the 980px `container-text`; body copy caps at 42rem/68ch. Only reading blocks (`portableText`, 720px) are left-aligned.

## Layout

Full-bleed sections, each `<section class="canvas-frost|canvas-white|canvas-dark section-space page-gutter">`, stacked with no gaps between canvases; the alternation of frost and white is the only section separator (no rules between sections). Vertical rhythm is `--section-y: clamp(4rem, 8vw, 7rem)` (≥64px) with a 0.6× small variant; a section header sits 48–64px (`mb-12 md:mb-16`) above its content. Gutter is `clamp(1.25rem, 4vw, 2.75rem)`.

Containers, all centered: page 1440px (nav, product bar, hero), site 1200px (tile grids, tables, media, two-up splits), text 980px (headline + tagline, footer), prose 720px (reading blocks). Copy inside a centered header caps at 24ch (headline) / 42rem (tagline).

Grids: tiles 2-up at md, 3-up at lg when ≥6 items; gallery 3-col (2 on md) with the first item spanning 2 when count % 3 == 1; split-content two halves in `container-site` (image 4:3, copy `max-w-[34rem]` vertically centered, `reverse` swaps order); stat strip 2–4 columns with hairline rules top and bottom (`py-10`); product finder two tiles side by side at lg; feature tour sticky 4:3 media beside a stepped rail. Tailwind's default breakpoints (sm 640, md 768, lg 1024) are the only breakpoints used.

The shell: a sticky 44px carbon global nav (`.dark`, `bg-carbon/95 backdrop-blur-md`) with the real D-D wordmark left (white SVG, `h-8`), 12px menu links centered (lg+), locale toggle and a hamburger right; under it a sticky 52px white product bar (`bg-white/90 backdrop-blur-md`, hairline bottom border) with the page title (21/600) left, up to eight 12px jump links right (md+), and one small filled lime pill ("Find a stockist"). Jump links are the first-occurrence block types whose eyebrow (else headline) exists, truncated at 24 characters; hero and CTA are excluded. Every block gets `scroll-mt` equal to header + product-bar height. Mobile: menu becomes a carbon sheet of 17px links with hairline (white/10) dividers and a primary pill; the product bar keeps title + pill.

The footer is a frost canvas in `container-text`: logo (inverted to carbon), 12px link columns (600 heads, ash links, underline on hover), hairline divider, 12px legal row.

## Elevation & Depth

Flat by doctrine. Depth is carried by canvas alternation and by object-on-ground: a tile is frost on white, white on frost, carbon on dark; a `.media` frame is frost on white, carbon on dark. Borders are 1px hairline. `.elevated` is defined as `box-shadow: none`. Sticky bars use `backdrop-blur-md` on 90–95% opaque grounds; no other blur or glass exists.

### Shadow Vocabulary
- **Product shadow** (`filter: drop-shadow(3px 5px 30px rgb(0 0 0 / 0.22))`): the only shadow in the system, applied only to product cut-outs (PNG on white). Never on tiles, pills, bars or media frames.

### Named Rules
**The One Shadow Rule.** If it isn't a product cut-out, it has no shadow. Tiles, pills, inputs, tables and popovers are flat; the locale listbox uses a 1px hairline ring instead.

## Shapes

Two radii and nothing in between: pills are fully round (980px) and every rectangular object is gently rounded (8px): `.media` frames, `.tile`/`.card`, `.field`, table column images, video frame. Segmented controls, severity chips, before/after labels and handle, video hint pill and the LED chip are pills. Focus rings are 2px lime-deep (lime on dark), offset 2px, with a 4px radius. Rules are 1px hairline, never 2px, never coloured. Product cut-outs are never cropped; photographs live in aspect-ratio frames (4:3 splits/tour, 1:1 gallery and product images, 16:9 video, 16:10 before/after). Icons are 1.5-stroke line SVGs, 11–24px, `currentColor` in ash or carbon; no glyph icon fonts, no emoji.

## Components

### Buttons (ActionLink pills)
- **Shape:** fully round (980px), `inline-flex`, gap 6px, 17px/1.17, weight 400, −0.022em, 150ms colour transitions.
- **Primary:** lime fill, carbon text, 1px lime border, `11px 15px`; hover #a3d63f. The accent's only home.
- **Secondary:** transparent, lime-deep text and 1px border; hover fills lime-deep with white text. On dark canvases lime text/border, hover lime fill with carbon text. Always paired to the right of a primary; never alone as the sole action.
- **Text (ghost):** no padding or border, lime-deep text with an 11px 1.5-stroke chevron; hover underline; lime on dark. Used for "Learn more ›", "Watch the film", downloads.
- **Small:** `6px 12px`, 14px; used in the product bar and dense rows.

### Chips
- **Segmented control:** pebble pill track with 4px padding; options `body-sm` ash, hover carbon; selected `bg-lime text-carbon` (the allowed selected use). Radiogroup semantics with arrow-key movement.
- **Severity chips:** caption-size pills, pebble/carbon; alarm state #fde8e6/danger.
- **In-media labels:** white pills with hairline border, `body-sm` carbon (before/after "New roll"/"Used roll", how-it-works step badge, video privacy note is white/10 on dark).

### Cards / Containers (tiles)
- **Corner Style:** 8px.
- **Background:** frost on a white section, white on a frost section, carbon on dark; automatic via `.canvas-frost .tile` and `.dark .tile`.
- **Shadow Strategy:** none.
- **Border:** none; internal rows use hairline top/bottom borders.
- **Internal Padding:** 24px; element gap 12px (`mt-3`); h4 title + `body-sm text-ash` body.
- **Rule:** a tile is a real object: a product (product list, comparison), a control panel (finder inputs/result, LED panel), a form, a spec table, a steps list. Feature and testimonial tiles carry text on white/frost respectively; a text-only card is never placed on the frost canvas where the canvas itself is the surface.

### Media
- `.media`: 8px, `overflow-hidden`, frost ground (carbon on dark), fixed aspect ratio, `object-cover` for photographs and `object-contain` for cut-outs (bg-white). Captions are `.caption` centered, `mt-3/4`.

### Inputs / Fields
- **Style:** white fill, 1px hairline, 8px radius, `12px 14px`, 17px, full width; labels `body-sm`; placeholders ash. Numeric fields take `.num` and 21/600 carbon.
- **Focus:** 2px lime-deep outline, offset 0, border goes transparent.
- **Range slider:** 1px hairline track with carbon fill to the value, 20px white thumb with hairline border.
- **Notices:** `body-sm`/`caption` inside the tile; success shows a 48px lime disc with a carbon check.

### Navigation
- **Global nav:** 44px, `bg-carbon/95` blur, white/80 12px links → white on hover, logo left, locale button right, hamburger (two 17px hairlines) under lg. Skip link becomes a lime pill on focus.
- **Product bar:** 52px white/90 blur, hairline underline, title 21/600, 12px graphite links → carbon when `aria-current` (IntersectionObserver, root margin −40%/−55%), small primary pill.
- **Footer:** frost, 12px columns, hairline divider.

### Figures (signature)
Big tabular numbers: `.figure` at 40px (finder, tour) or display size (stat strip), 600, line-height 1, carbon (white on dark); unit in `.figure-unit` 400 ash at 17–21px; label `body-sm text-ash` beneath. Stat strip counts up; hairline rules frame the row.

### Feature tour / how-it-works (signature)
Sticky 4:3 `.media` beside a 1px hairline rail with a carbon active segment; step titles `h3` carbon (ash inactive) with a 500ms colour transition; how-it-works steps live in a white tile with `body-sm` numbers and a carbon progress fill; autoplay preserved.

### Motion
One authored scroll motion: rise-in. `Reveal`/`SectionHeader` add `.rise`; `RiseObserver` adds `html.js` and toggles `.is-in` once at 10% visibility (root margin −8%). Transition 560ms, `cubic-bezier(0.16, 1, 0.3, 1)`, from `translateY(14px)`; staggers of 60–80ms; no entrance on the hero; `prefers-reduced-motion` disables it and marks everything in. Block-native motion (finder result swap 350ms/12px, before/after drag, count-up, tour) uses the same ease.

## Do's and Don'ts

### Do:
- **Do** alternate `canvas-frost` and `canvas-white` sections; the hero is white and the next section starts frost.
- **Do** put lime only in a filled pill fill or a selected state, and lime-deep only in outlines, links and focus rings.
- **Do** open every section with a centered `h2` (40/600, ≤24ch) and an optional 300-weight whisper tagline (≤42rem) via `SectionHeader`.
- **Do** lead with the client's original photography in 8px `.media` frames or uncropped `object-contain` cut-outs on white; `.product-shadow` only on cut-outs.
- **Do** use hairline (#d2d2d7) 1px rules for tables, stat rows, rails and dividers; carbon for progress and slider fills.
- **Do** pair pills: filled primary first, outlined secondary beside it, ghost chevron links for tertiary actions.
- **Do** keep tiles at 8px / 24px padding, frost on white and white on frost, and only for real objects (products, controls, forms, spec tables, quotes).
- **Do** use `.figure` tabular 600 numbers with ash 400 units for every measurement.
- **Do** keep icons 1.5-stroke line SVGs in ash/carbon, 11–24px.
- **Do** rely on rise-in as the only scroll motion (560ms ease-out-expo, 14px) and honour reduced motion.

### Don't:
- **Don't** render an eyebrow, kicker or section number above a heading (`eyebrow` labels the product bar's jump link only).
- **Don't** use dark canvases outside the global nav, film/video and 360° sections; never as a product stage behind text.
- **Don't** colour text, borders, figures or icons lime; no lime lines, no lime headings, no "Recommended" filled pills (use lime-deep `body-sm` text).
- **Don't** add shadows, gradients, glass, glow, rings or blur beyond the two sticky bars' backdrop blur and the single product drop shadow.
- **Don't** set headlines at weight 700, ship a separate display face, or use uppercase tracked labels.
- **Don't** put a text-only card on the frost canvas; the canvas is the surface.
- **Don't** crop product cut-outs or leave sections without a photograph where one exists.
- **Don't** introduce a second accent, brand colours from imagery, or an unpaired outlined pill.
- **Don't** add entrance motion to the hero or any motion other than rise-in and a block's own signature interaction.
