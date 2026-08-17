# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences with equal weight on every landing page (confirmed):

- **Reef / aquarium hobbyists** researching an upgrade — arriving from ads, social, YouTube reviews or the main site; comparing options; the job is "decide whether this is the right unit for my tank, then find where to buy it or ask a question".
- **Dealers / retailers** evaluating what to stock — the job is "understand the product line, its differentiation and support, then contact D-D / become a stockist".

Both are literate in the hobby's vocabulary (sump, return pump, dKH, PAR, fleece filter). English is the source language; DE / FR / PL / JA follow.

## Product Purpose

A landing-page generator for D-D The Aquarium Solution's own product families (launch product: **ClariSea Gen 3** automatic fleece filters; also Spektrum LED, Funktion pumps, KH Manager). Editors compose pages from blocks in Sanity; the Next.js site renders them in five languages. Success = a visitor understands the product quickly, trusts it, and takes one of two actions: **find a stockist** (dealer locator on the main site) or **contact D-D**. There is no cart.

## Positioning

Confirmed by the user:

- **Engineering-first, no gimmicks** — quiet, serviceable, over-built hardware at real value for money; features exist because they solve a tank problem, not to decorate a spec sheet.
- **Worldwide stockist network** — D-D sells through specialist aquarium retailers; the dealer relationship is part of the product. Every page routes to a stockist, never to a checkout.

Not claimed (do not fabricate): awards, market-share numbers, named-brand comparisons, review scores.

## Operating Context

- Landing pages sit on a marketing/landing subdomain beside the legacy Drupal site (theaquariumsolution.com), which keeps the catalogue, dealer locator (`/stockists`), manuals and support. Pages link out to it.
- Content is authored in Sanity Studio (embedded at `/studio`) with Presentation/visual editing; a `demo.ts` fallback renders the same pages without Sanity.
- Assets: a video shoot for ClariSea is scripted (`docs/briefs/clarisea-shooting.md`); until it lands, placeholders and a proxy MP4 stand in. The old site has only 2D Drupal image derivatives; no 360° material exists yet.

## Capabilities and Constraints

- Block-based pages (21 blocks: hero w/ video, stat strip, intro, rich text, feature list/tour, split content, gallery, product list, 360°/zoom viewer, before/after, comparison table, product finder calculator, how-it-works stepper, indicator/alarm legend, video, FAQ + specs, testimonials, CTA, contact form).
- Product = family document (models as comparison columns / finder rules); localized slugs per language; en fallback with noindex until a translation exists.
- Stack: Next.js 16 App Router, Tailwind 4, motion, Sanity 6 (TypeGen, Presentation, Live). No edge runtime.
- Undecided: final domain (`marketing.` vs `landing.theaquariumsolution.com`), analytics/consent, translation workflow.

## Brand Commitments

- Name: **D-D The Aquarium Solution** (short "D-D"). Company: D-D The Aquarium Solution Ltd.
- **Binding:** the D-D logo and the brand lime (`#99CC33`) as accent must carry over. Everything else — typography, layout, colour world, imagery treatment — is free for the redesign (confirmed by the user).
- Logo asset on hand is a white-only SVG (needs a dark-safe/light-safe version from the client).
- **Standing design preference (confirmed):** best-in-class *conventional* — the category standard executed at high craft, sitting alongside **apple.com** and **redseafish.com**; their craft level is the bar. Not luxury, not loud/gamified, not generic SaaS/AI-landing visuals (glass, neon glow on dark, cream+serif editorial).
- Voice from the shoot script: plain, confident, benefit-led, a little wry ("It's simply the clever choice"); no superlatives without a mechanism behind them.

## Evidence on Hand

- ClariSea video script / shot list: `docs/briefs/clarisea-shooting.md` (verbatim marketing copy, planned shots).
- Old-site product pages: specs, Gen 3 feature list, controller alarm table, manuals (EN/DE/FR for Spektrum; EN/DE for KH Manager).
- Proxy footage: `public/videos/clarisea-proxy.mp4`.
- Absent (must not be fabricated): customer testimonials (demo quotes are placeholders and must be replaced or removed), 360° imagery, real product photography for the new pages, pricing.

## Product Principles

1. **Mechanism before adjective** — every claim on a page points at a part, a number or a behaviour the visitor can verify.
2. **Two readers, one page** — hobbyist and dealer both find their path within the first two screens (understand → compare/size → find stockist / contact).
3. **Editor-owned** — anything a marketer would want to change is a Sanity field; blocks stay self-contained.
4. **Route to the stockist, not the cart** — the primary action is always "find a stockist"; contact is the fallback.
5. **Ship in English, design for five** — layouts must survive German length and Japanese script without redesign.
