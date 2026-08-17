/**
 * Renders the design direction as an HTML comment (first child of <body>) so
 * it survives the production build and can be audited against the render.
 */
const CONTRACT = `
THESIS: The category standard for aquarium hardware, executed at Apple / Red Sea craft: one product on a stage, one idea per section, one action. It refuses the templated "AI landing page" arrangement (icon-card grids, eyebrows over every heading, neon-on-black glow, cream+serif editorial).
OWN-WORLD: White and #f5f5f7 grounds with near-black (#0b0b0c) product stages; text #1d1d1f / #6e6e73; brand lime #99cc33 only on primary actions and key figures. One family, Archivo (variable width): semibold sentence-case display, tight tracking; narrow-width heavy tabular figures for measurements. Pills for actions (lime primary, ink secondary), 18-20px media radii, hairlines #d2d2d7, generous section rhythm (72-136px). Motion: one rise-in on scroll (expo ease-out), sticky in-page product bar; hero visible by default.
STORY: A reef keeper or dealer sees the product working, understands it is safe and serviceable (alarms, fail-safe overflow, 40 m roll, tool-free service), sizes it, compares the two models, and finds a stockist.
FIRST VIEWPORT: Full-bleed product stage: video/still of the unit in the sump, headline (display-xl) top-left over a soft dark gradient, one-sentence lead, two pills (primary "Which size do I need?", secondary "Find a stockist"); compact 48px global bar; sticky product bar with jump links follows.
FORM: Canon (standing exit): the category standard played straight; references apple.com and redseafish.com. Code-first (no image generation). seed key eaea6a96 (unscoped roll recorded, not used).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
`.trim();

export default function DirectionContract() {
  return <script type="text/x-impeccable-contract" dangerouslySetInnerHTML={{ __html: `<!--\n${CONTRACT}\n-->` }} />;
}
