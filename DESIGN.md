---
name: D-D The Aquarium Solution — ClariSea (v3, dark register)
description: A black room with a single lime switch — the Apple design architecture applied to aquarium hardware in its dark register; photography of the product is the design.
colors:
  lime: "#99cc33"
  lime-deep: "#99cc33"
  lime-signal: "#b9dd6b"
  onyx: "#000000"
  carbon: "#1d1d1f"
  pebble: "#2c2c2e"
  hairline: "#424245"
  ash: "#86868b"
  mist: "#a1a1a6"
  fg: "#f5f5f7"
  fg-muted: "#86868b"
  canvas: "#000000"
  canvas-alt: "#1d1d1f"
  fill: "#2c2c2e"
  frost: "#1d1d1f"
  white: "#ffffff"
  danger: "#ff453a"
  alarm-well: "#3a1c1a"
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
    textColor: "{colors.lime}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "11px 15px"
  button-secondary-hover:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.onyx}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.lime}"
    typography: "{typography.body}"
    padding: "0"
  button-small:
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  tile:
    backgroundColor: "{colors.canvas-alt}"
    textColor: "{colors.fg}"
    rounded: "{rounded.card}"
    padding: "{spacing.tile-pad}"
  tile-on-lift:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg}"
    rounded: "{rounded.card}"
    padding: "{spacing.tile-pad}"
  media:
    backgroundColor: "{colors.canvas-alt}"
    rounded: "{rounded.media}"
  media-on-lift:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.media}"
  field:
    backgroundColor: "{colors.canvas-alt}"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
    rounded: "{rounded.input}"
    padding: "12px 14px"
  segmented-control:
    backgroundColor: "{colors.pebble}"
    textColor: "{colors.fg-muted}"
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
    backgroundColor: "{colors.onyx}"
    textColor: "{colors.fg-muted}"
    typography: "{typography.nav}"
    height: "{spacing.productbar-h}"
  severity-chip:
    backgroundColor: "{colors.pebble}"
    textColor: "{colors.fg}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  severity-chip-alarm:
    backgroundColor: "{colors.alarm-well}"
    textColor: "{colors.danger}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: D-D The Aquarium Solution — ClariSea (v3, dark register)

## Overview

**Creative North Star: "A Black Room With a Single Lime Switch"**

This is the Apple design architecture (Refero "Apple") translated for reef-keeping hardware, in its dark register. The page is a sequence of full-bleed, centered, stacked, symmetric sections on two canvases, black (#000) and a #1d1d1f lift, alternating as the story moves; the hero, film and 360° sections sit on black and the first lift begins with the next section. Every section opens with a centered white headline and, optionally, a light 300-weight "whisper" tagline in fg; below it sits the thing itself, a photograph or product cut from the client's own dark studio photography, feathered into black. Copy is fg (#f5f5f7) on black, ash (#86868b) for the supporting voice, and it stays inside a 980px column. There are no decorative colours, no gradients, no glass, no glow, and exactly one shadow (a soft drop shadow reserved for product cut-outs). Real white is reserved for headings, photo wells, pill labels, the before/after handle and the slider thumb.

Colour is a switch, not a palette. Lime (#99cc33) appears where the user can act or has chosen: the filled pill, the selected segment of a segmented control, and, because full lime passes 9:1 on black, also the outlined secondary pill, ghost links, prose links and focus rings. `lime-deep` is kept as a token name but resolves to the same lime on this branch. Nothing else, no border, figure, icon or heading, is coloured. Numbers are big and tabular in fg; icons are 1.5-stroke line SVGs in ash/fg; progress and slider fills are fg on hairline (#424245). Type is SF Pro on Apple devices and Inter everywhere else, on a major-second scale from 17px with Apple's slightly positive tracking on large sizes and slightly negative tracking on body.

The system rejects the previous v2 world explicitly: no dark-glow product stages behind copy, no card grids sitting on the canvas for text alone, no eyebrows or kickers over headings, no second accent, no 700-weight headlines, no shipped display face. Dark here is a flat black room, not a lit stage.

**Key Characteristics:**
- Two dark canvases (black #000 / lift #1d1d1f) alternating; `color-scheme: dark`; the global nav is carbon over both.
- One accent with two jobs: lime fills the primary pill and the selected state; the same lime outlines the secondary pill, draws links and focus rings.
- Photography-led: the hero is the unit cut from the brand's dark banner feathered into black; product cut-outs sit `object-contain` on transparent or lift wells; white-background renders are not used on this branch's ClariSea page.
- Apple type scale from 17px, weight 600 for headings, 300 for the whisper tagline, never 700.
- Two-tier navigation: 44px carbon/90 blurred global nav with the real D-D wordmark and a white/10 hairline, 52px sticky black/80 blurred product bar generated from block eyebrows.
- Pills 980px, everything else 8px; hairlines #424245; one product-image shadow; a single rise-in scroll motion.

## Colors

Apple's dark neutral ramp with a single lime switch; the ramp itself is the palette.

### Primary
- **Lime** (#99cc33): the accent's home. Filled primary pill fill (carbon text), the selected segment of a segmented control, the success mark in the contact form, text-selection highlight (black text), and, on this dark register, the outlined secondary pill's border and text, ghost text links, prose links and every `:focus-visible` ring. Hover on the filled pill lightens to #a3d63f; hover on the outlined pill fills lime with black text. Never headings, figures, icons or rules.
- **Lime Deep** (#99cc33): token retained for the light register's AA companion; on this branch it equals lime and `.text-lime-deep` renders full lime (9:1 on black).
- **Lime Signal** (#b9dd6b): declared for rare decorative strokes/image outlines; not used on the built page.

### Neutral
- **Onyx / Canvas** (#000000): the primary canvas (`.canvas-white` resolves to black), the hero, film and 360° sections, the product bar ground (80% + blur), the LED chip disc, and tiles/`.media` wells on lift sections.
- **Carbon / Canvas-alt / Frost** (#1d1d1f): the lift canvas (`.canvas-frost`), the global nav ground (90% + blur) and mobile nav sheet, the footer, tiles, `.media` wells and `.field` fills on black sections, and the text colour inside a lime pill.
- **Foreground** (#f5f5f7): body text on both canvases; the whisper tagline; slider and progress fills; active tour titles on non-film canvases.
- **White** (#ffffff): headings h1–h4, global-nav links on hover, active product-bar links, footer column heads, pill labels inside media, before/after handle, slider thumb.
- **Ash / Fg-muted** (#86868b): supporting body, tile body, table labels, captions, `.lead`, `.label`, placeholders, inactive tour steps, product-bar links at rest, icon strokes, figure units. AA on both #000 and #1d1d1f.
- **Mist** (#a1a1a6): ash's slightly brighter role inside `.dark`/`.canvas-dark` contexts (`.lead`, `.caption`, `.label`, stat units on film sections).
- **Pebble / Fill** (#2c2c2e): segmented-control track, severity chips, disabled fills.
- **Hairline** (#424245): every rule and border: table rows, stat-strip top/bottom rules, tour rail, slider track, thumb border, field border, before/after handle border, product-bar underline, footer dividers, prose blockquote rule, scrollbar thumb, locale-listbox ring.
- **Danger** (#ff453a): alarm severity text in the indicator legend only, on the alarm well (#3a1c1a).

### Named Rules
**The Single Switch Rule.** Lime is the only colour. It may fill the primary pill and the selected state, and on this dark register it may also draw an outline, a link or a focus ring; it may never colour a heading, figure, icon, rule or background wash. Everything else is fg, ash, hairline, lift or black.

**The Two Canvases Rule.** Sections alternate black and lift; the hero, film and 360° sections are black and the first lift begins with the next section. There is no third canvas and no product "stage" with a glow or vignette behind copy.

**The Foreground Fill Rule.** Progress rails, slider fills, active tour segments and how-it-works progress use fg (#f5f5f7; pure white on film sections), not lime. Selection is lime; progress is foreground.

**The Real White Rule.** #ffffff is spent only on headings, photo wells that need it, pill labels, the before/after handle and the slider thumb. Body copy is #f5f5f7; there is no white surface.

## Typography

**Display Font:** SF Pro Display via `-apple-system` / `BlinkMacSystemFont` (with Inter, then Helvetica Neue)
**Body Font:** SF Pro Text via the system stack (with Inter, then Helvetica Neue)
**Label/Mono Font:** none; figures use tabular lining numerals of the same family (`.figure`, `.num`)

**Character:** Apple's own voice: confident 600-weight white headings with a hair of positive tracking, a light 300-weight tagline that whispers under them in fg, and a compact 17px body with negative tracking. No display face is shipped; Inter (weights 300–700, `--font-inter`) is only the fallback for non-Apple platforms.

### Hierarchy
- **Display** (600, clamp(2.5rem, 4.6vw, 3.5rem) ≈ 40–56px, 1.07, +0.011em, white): the hero `h1`, centered, `max-w-[18ch]`, `text-wrap: balance`.
- **Heading** (600, clamp(2rem, 3.4vw, 2.5rem) ≈ 32–40px, 1.14, +0.011em, white): every section `h2` via `SectionHeader`, centered, `max-w-[24ch]`. `.heading-lg` (400, up to 44px) exists for the animated headline's light large heading.
- **Heading-sm** (600, 28px, 1.18, +0.007em): `h3`, split-content and feature-tour step titles (ash when inactive).
- **Subheading** (600, 21px, 1.24, −0.005em): `h4` tile titles, product-bar title, comparison column names, FAQ/spec headlines. `.subheading` (400) is the testimonial quote voice.
- **Whisper** (300, clamp(21px, 1.9vw, 26px), 1.24, +0.004em, fg): the tagline under headlines and the CTA body; `max-w-[40–42rem]`.
- **Body** (400, 17px, 1.47, −0.016em, fg): default; supporting copy takes `text-fg-muted`; prose measure 68ch.
- **Body-sm** (400, 14px, 1.29, −0.016em): tile body, table labels and cells, form labels, step numbers, pill labels inside media, small pill.
- **Caption** (400, 12px, 1.33, −0.01em, ash): image captions, footnotes, slider min/max, severity chips, footer.
- **Nav** (400, 12px, −0.01em): global-nav links (white/80 → white) and product-bar jump links (ash → white when current).
- **Figure** (600, 40px or display size, 1, tabular, fg): big numbers in stat strip, feature tour and product finder; units in `.figure-unit` (400, 17–21px, ash).

### Named Rules
**The No-Eyebrow Rule.** Nothing sits above a heading. `SectionHeader` accepts `eyebrow` but never renders it; the field feeds the product bar's jump-link label instead. No kickers, no section numbers except in a real sequence (how-it-works keeps its numbers).

**The 600 Ceiling Rule.** Headings are weight 600 and never 700; the tagline is 300; body is 400. Emphasis comes from size and canvas, not weight.

**The Center Column Rule.** Headline + whisper are centered in the 980px `container-text`; body copy caps at 42rem/68ch. Only reading blocks (`portableText`, 720px) are left-aligned.

## Layout

Full-bleed sections, each `<section class="canvas-white|canvas-frost|canvas-dark section-space page-gutter">` (on this branch `canvas-white` = black, `canvas-frost` = lift, `canvas-dark` = black with white headings), stacked with no gaps between canvases; the alternation of black and lift is the only section separator (no rules between sections). Vertical rhythm is `--section-y: clamp(4rem, 8vw, 7rem)` (≥64px) with a 0.6× small variant; a section header sits 48–64px (`mb-12 md:mb-16`) above its content. Gutter is `clamp(1.25rem, 4vw, 2.75rem)`.

Containers, all centered: page 1440px (nav, product bar, hero), site 1200px (tile grids, tables, media, two-up splits), text 980px (headline + tagline, footer), prose 720px (reading blocks). Copy inside a centered header caps at 24ch (headline) / 42rem (tagline). The hero image sits in an 880px column, `object-contain`, `mt-[clamp(2rem,5vw,4rem)]` under the pills.

Grids: tiles 2-up at md, 3-up at lg when ≥6 items; gallery 3-col (2 on md) with the first item spanning 2 when count % 3 == 1, on the lift canvas; split-content two halves in `container-site` (image 4:3, copy `max-w-[34rem]` vertically centered, `reverse` swaps order); stat strip 2–4 columns with hairline rules top and bottom (`py-10`); product finder two tiles side by side at lg on the lift canvas; feature tour sticky media (4:3, or portrait 4:5 capped at `100svh − 8rem`) beside a stepped rail; comparison table sticky first column with `bg-canvas` and transparent 160px photo wells. Tailwind's default breakpoints (sm 640, md 768, lg 1024) are the only breakpoints used.

The shell: a sticky 44px global nav (`.dark`, `bg-carbon/90 backdrop-blur-md`, `border-b border-white/10`) with the real D-D wordmark left (white SVG, `h-8`), 12px menu links centered (lg+), locale toggle and a hamburger right; under it a sticky 52px product bar (`bg-black/80 backdrop-blur-md`, hairline bottom border) with the page title (21/600) left, up to eight 12px jump links right (md+), and one small filled lime pill ("Find a stockist"). Jump links are the first-occurrence block types whose eyebrow (else headline) exists, truncated at 24 characters; hero and CTA are excluded. Every block gets `scroll-mt` equal to header + product-bar height. Mobile: menu becomes a carbon sheet of 17px white/90 links with white/10 dividers and a primary pill; the product bar keeps title + pill.

The footer is a lift canvas in `container-text`: logo, 12px link columns (600 white heads, ash links, underline on hover), hairline divider, 12px ash legal row.

## Elevation & Depth

Flat by doctrine. Depth is carried by canvas alternation and by object-on-ground: a tile is lift on black, black on lift; a `.media` frame is lift on black, black on lift. Borders are 1px hairline. `.elevated` is defined as `box-shadow: none`. Sticky bars use `backdrop-blur-md` on 80–90% opaque grounds; no other blur, glass, glow or vignette exists, and the LED indicator's animated glow is the object itself, not chrome.

### Shadow Vocabulary
- **Product shadow** (`filter: drop-shadow(3px 5px 30px rgb(0 0 0 / 0.22))`): the only shadow in the system, applied only to product cut-outs. Never on tiles, pills, bars or media frames.

### Named Rules
**The One Shadow Rule.** If it isn't a product cut-out, it has no shadow. Tiles, pills, inputs, tables and popovers are flat; the locale listbox uses a 1px hairline ring instead.

## Shapes

Two radii and nothing in between: pills are fully round (980px) and every rectangular object is gently rounded (8px): `.media` frames, `.tile`/`.card`, `.field`, table column images, video frame. Segmented controls, severity chips, before/after labels and handle, video hint pill and the LED chip are pills. Focus rings are 2px lime, offset 2px, with a 4px radius. Rules are 1px hairline, never 2px, never coloured. Product cut-outs are never cropped; photographs live in aspect-ratio frames (4:3 splits/tour, 4:5 portrait tour, 1:1 gallery and product images, 16:9 video, 16:10 before/after). Icons are 1.5-stroke line SVGs, 11–24px, `currentColor` in ash or fg; no glyph icon fonts, no emoji.

## Components

### Buttons (ActionLink pills)
- **Shape:** fully round (980px), `inline-flex`, gap 6px, 17px/1.17, weight 400, −0.022em, 150ms colour transitions.
- **Primary:** lime fill, carbon text, 1px lime border, `11px 15px`; hover #a3d63f. The accent's filled home.
- **Secondary:** transparent, lime text and 1px lime border; hover fills lime with black text (carbon inside `.dark`). Always paired to the right of a primary; never alone as the sole action.
- **Text (ghost):** no padding or border, lime text with an 11px 1.5-stroke chevron; hover underline. Used for "Learn more ›", "Watch the film", downloads.
- **Small:** `6px 12px`, 14px; used in the product bar and dense rows.

### Chips
- **Segmented control:** pebble (#2c2c2e) pill track with 4px padding; options `body-sm` ash, hover fg; selected `bg-lime text-carbon` (the allowed selected use). Radiogroup semantics with arrow-key movement.
- **Severity chips:** caption-size pills, pebble/fg; alarm state alarm-well (#3a1c1a) with danger (#ff453a) text.
- **In-media labels:** white pills with hairline border, `body-sm` carbon (before/after "New roll"/"Used roll", how-it-works step badge); the video privacy note is white/10.

### Cards / Containers (tiles)
- **Corner Style:** 8px.
- **Background:** lift on a black section, black on a lift section; automatic via `.canvas-frost .tile`.
- **Shadow Strategy:** none.
- **Border:** none; internal rows use hairline top/bottom borders.
- **Internal Padding:** 24px; element gap 12px (`mt-3`); h4 title (white) + `body-sm text-fg-muted` body.
- **Rule:** a tile is a real object: a product (product list, comparison), a control panel (finder inputs/result, LED panel), a form, a spec table, a steps list. A text-only card is never placed on the canvas where the canvas itself is the surface.

### Media
- `.media`: 8px, `overflow-hidden`, lift ground (black on lift sections), fixed aspect ratio, `object-cover` for photographs and `object-contain` for cut-outs. Comparison-table photo wells are `bg-transparent`; the hero image has no well at all. Captions are `.caption` centered, `mt-3/4`.

### Inputs / Fields
- **Style:** lift fill (black on lift sections), 1px hairline, 8px radius, `12px 14px`, 17px fg, full width; labels `body-sm`; placeholders ash. Numeric fields take `.num` and 21/600 fg.
- **Focus:** 2px lime outline, offset 0, border goes transparent.
- **Range slider:** 1px hairline track with fg fill to the value, 20px white thumb with hairline border.
- **Notices:** `body-sm`/`caption` inside the tile; success shows a 48px lime disc with a carbon check.

### Navigation
- **Global nav:** 44px, `bg-carbon/90` blur, white/10 hairline below, white/80 12px links → white on hover, logo left, locale button right (listbox: white, carbon text, hairline ring), hamburger (two 17px white hairlines) under lg. Skip link becomes a lime pill on focus.
- **Product bar:** 52px `bg-black/80` blur, hairline underline, title 21/600 white, 12px ash links → white when `aria-current` (IntersectionObserver, root margin −40%/−55%), small primary pill.
- **Footer:** lift canvas, 12px columns, hairline divider.

### Figures (signature)
Big tabular numbers: `.figure` at 40px (finder, tour) or display size (stat strip), 600, line-height 1, fg (white on film sections); unit in `.figure-unit` 400 ash at 17–21px; label `body-sm text-fg-muted` beneath. Stat strip counts up; hairline rules frame the row.

### Feature tour / how-it-works (signature)
Sticky `.media` (4:3, or portrait 4:5 capped to the viewport) beside a 1px hairline rail with an fg active segment (white on the film-dark tone); step titles `h3` white (ash inactive) with a 500ms colour transition; how-it-works steps live in a tile with `body-sm` numbers and an fg progress fill; autoplay preserved.

### Indicator legend (signature)
A hairline-ruled accordion of LED states beside a lift tile: 64px black disc holding a 28px animated LED, `body-sm` ash labels, severity chip (pebble; alarm-well + danger for alarms). No mock device screen.

### Motion
One authored scroll motion: rise-in. `Reveal`/`SectionHeader` add `.rise`; `RiseObserver` adds `html.js` and toggles `.is-in` once at 10% visibility (root margin −8%). Transition 560ms, `cubic-bezier(0.16, 1, 0.3, 1)`, from `translateY(14px)`; staggers of 60–80ms; no entrance on the hero; `prefers-reduced-motion` disables it and marks everything in. Block-native motion (finder result swap 350ms/12px, before/after drag, count-up, tour, LED pulse) uses the same ease.

## Do's and Don'ts

### Do:
- **Do** alternate `canvas-white` (black) and `canvas-frost` (lift #1d1d1f) sections; the hero is black and the next section starts lift.
- **Do** put lime in a filled pill fill or a selected state, and only otherwise in an outline, a link or a focus ring.
- **Do** open every section with a centered white `h2` (40/600, ≤24ch) and an optional 300-weight fg whisper tagline (≤42rem) via `SectionHeader`.
- **Do** lead with the client's own dark studio photography: the hero unit feathered into black, 8px `.media` frames, or uncropped `object-contain` cut-outs on transparent/lift wells; `.product-shadow` only on cut-outs.
- **Do** use hairline (#424245) 1px rules for tables, stat rows, rails and dividers; fg for progress and slider fills.
- **Do** pair pills: filled primary first, outlined lime secondary beside it, ghost chevron links for tertiary actions.
- **Do** keep tiles at 8px / 24px padding, lift on black and black on lift, and only for real objects (products, controls, forms, spec tables, quotes).
- **Do** use `.figure` tabular 600 numbers in fg with ash 400 units for every measurement.
- **Do** keep icons 1.5-stroke line SVGs in ash/fg, 11–24px.
- **Do** rely on rise-in as the only scroll motion (560ms ease-out-expo, 14px) and honour reduced motion.

### Don't:
- **Don't** render an eyebrow, kicker or section number above a heading (`eyebrow` labels the product bar's jump link only).
- **Don't** introduce a light canvas, a white surface, or white-background product renders on this branch; white is for headings, pill labels, handles and thumbs.
- **Don't** colour headings, figures, icons or rules lime; no lime lines, no lime washes, no "Recommended" filled pills (use lime `body-sm` text).
- **Don't** add shadows, gradients, glass, glow, vignettes, rings or blur beyond the two sticky bars' backdrop blur, the LED's own pulse and the single product drop shadow.
- **Don't** set headlines at weight 700, ship a separate display face, or use uppercase tracked labels.
- **Don't** put a text-only card on the canvas; the canvas is the surface.
- **Don't** crop product cut-outs or leave sections without a photograph where one exists.
- **Don't** introduce a second accent, brand colours from imagery, or an unpaired outlined pill.
- **Don't** add entrance motion to the hero or any motion other than rise-in and a block's own signature interaction.
