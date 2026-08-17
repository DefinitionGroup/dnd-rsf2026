/**
 * Renders the design direction as an HTML comment (first child of <body>) so
 * it survives the production build and can be audited against the render.
 */
const CONTRACT = `
THESIS: The Apple design architecture (refero.design/styles/apple) applied to aquarium hardware — a white room with a single lime switch. Full-bleed, centered, stacked, symmetric sections; photography of the product IS the design. It refuses dark-glow product stages, card grids on the canvas, decorative colour, and any second accent.
OWN-WORLD: Frost #f5f5f7 canvas alternating with white; near-black #1d1d1f only for the global nav and film sections. Text #1d1d1f / #6e6e73. Lime #99cc33 exclusively as filled-pill fill and selected state; lime-deep #6f9a1f for outlined pills and inline links; nothing else is coloured. SF Pro on Apple devices, Inter elsewhere: display 56/600 (+0.011em), heading 40/600, subhead 21/400, tagline 26/300 "whisper", body 17/400 (-0.016em), caption 12. Pills 980px; cards/images/inputs 8px; hairlines #d2d2d7; the only shadow is a soft product-image drop shadow. Section gap ≥64px, page 1440, copy centered ≤980px.
STORY: A reef keeper or dealer sees the ClariSea render on white, reads one line, watches it work, learns it is safe and serviceable (alarms, fail-safe overflow, 40 m roll, tool-free service), sizes it, compares SK-3000 vs SK-5000, finds a stockist.
FIRST VIEWPORT: 44px dark global nav with the real D-D logo; 52px white product bar (name left, jump links + small lime pill right); white hero canvas: centered display headline, whisper tagline, filled lime pill + outlined pill, then the product render (SK-5000 with rolls, original photography) on white; the frost canvas begins with the next section.
FORM: Brief-pinned world (user supplied the Refero Apple style); pinned direction beats the roll. Code-first. Prior seed key eaea6a96 recorded.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
`.trim();

export default function DirectionContract() {
  return <script type="text/x-impeccable-contract" dangerouslySetInnerHTML={{ __html: `<!--\n${CONTRACT}\n-->` }} />;
}
