/** Demo products in the resolved (locale-coalesced) shape of `productFragment`. EN copy only in v1. */
import type { ProductSummary } from "@/blocks/types";
import { captioned, img, key, pt } from "./demo-helpers";

function spec(label: string, value: string, unit?: string) {
  return { _key: key("spec"), label, value, unit: unit ?? null };
}

export const spektrum150: ProductSummary = {
  _id: "demo-product-spektrum-150",
  slug: "spektrum-150",
  name: "Spektrum 150",
  tagline: "Full-spectrum reef LED with the colour rendition corals were made for.",
  body: pt(
    "Spektrum 150 combines eight LED colours in a single optic so every coral shows its true fluorescence — without disco effects or hot spots.",
    "Programmable sunrise-to-moonlight schedules, silent passive cooling and a slim aluminium body that mounts on the tank rim or hangs from the ceiling.",
  ),
  category: "Lighting",
  sku: "SPK-150",
  image: img("original/spektrum-150-side.png", { width: 2400, height: 720 }),
  imageAlt: "Spektrum 150 reef LED light, side view",
  gallery: [
    captioned("spektrum-150.jpg", "Spektrum 150 from the front", "Slim aluminium body"),
    captioned("spektrum-150-detail.jpg", "Close-up of the Spektrum 150 lens cluster", "Eight-colour optic"),
    captioned("spektrum-150-mounted.jpg", "Spektrum 150 mounted above a reef tank", "Rim mount or hanging kit"),
  ],
  specs: [spec("Power", "150", "W"), spec("PAR at 30 cm", "550", "µmol/m²/s"), spec("Coverage", "60 × 60", "cm"), spec("Channels", "6"), spec("Dimensions", "40 × 20 × 3.2", "cm"), spec("Weight", "2.4", "kg"), spec("Warranty", "3", "years")],
  legacyUrl: "https://www.theaquariumsolution.com/product/8438/545",
  manualUrl: null,
  videoUrl: null,
};

export const funktionPump: ProductSummary = {
  _id: "demo-product-funktion-return",
  slug: "funktion-return-pump",
  name: "Funktion Return Pump",
  tagline: "DC return pumps that run whisper-quiet and sip power.",
  body: pt(
    "The Funktion Return range uses a sine-wave DC driver and a ceramic shaft to move water quietly and efficiently — from nano tanks to large reef systems.",
    "Ten flow settings, feed-mode pause and a dry-run cut-off are on the controller; the pump body strips down without tools for cleaning.",
  ),
  category: "Pumps",
  sku: "FRP",
  image: img("original/funktion-lineup.png", { width: 1800, height: 583 }),
  imageAlt: "The Funktion Return Pump range",
  gallery: [
    captioned("funktion-pump.jpg", "Funktion Return Pump", "Compact footprint"),
    captioned("funktion-pump-detail.jpg", "Funktion pump impeller and ceramic shaft", "Tool-free strip-down"),
    captioned("funktion-pump-lineup.jpg", "The Funktion Return Pump line-up", "Four sizes"),
  ],
  specs: [spec("Max flow", "8,000", "l/h"), spec("Max head", "4.5", "m"), spec("Power", "12–65", "W"), spec("Noise", "< 30", "dB"), spec("Outlet", "32", "mm"), spec("Controller", "10 steps + feed mode"), spec("Warranty", "2", "years")],
  legacyUrl: "https://www.theaquariumsolution.com/product/8364/443",
  manualUrl: null,
  videoUrl: null,
};

export const khManager: ProductSummary = {
  _id: "demo-product-kh-manager",
  slug: "kh-manager",
  name: "KH Manager",
  tagline: "Automatic alkalinity testing and dosing — the reef stays stable while you sleep.",
  body: pt(
    "KH Manager measures carbonate hardness up to 24 times a day and adjusts your dosing pump before corals ever notice a swing.",
    "Results, trends and alerts live in the app; reagent lasts for months and the unit calibrates itself.",
  ),
  category: "Water chemistry",
  sku: "KHM-1",
  image: img("original/kh-banner.jpg", { width: 2400, height: 720 }),
  imageAlt: "KH Manager alkalinity controller",
  gallery: [
    captioned("kh-manager.jpg", "KH Manager unit", "Compact controller"),
    captioned("kh-manager-detail.jpg", "KH Manager display showing a reading", "Live readings"),
    captioned("kh-manager-app.jpg", "KH Manager app on a phone showing a trend graph", "Trends & alerts"),
  ],
  specs: [spec("Measurements per day", "up to 24"), spec("Resolution", "0.05", "dKH"), spec("Range", "3–15", "dKH"), spec("Reagent per test", "1", "ml"), spec("Connectivity", "Wi-Fi + app"), spec("Dosing control", "Integrated"), spec("Warranty", "2", "years")],
  legacyUrl: "https://www.theaquariumsolution.com/product/8339/418",
  manualUrl: null,
  videoUrl: null,
};

export const demoProducts: ProductSummary[] = [spektrum150, funktionPump, khManager];

export const clarisea: ProductSummary = {
  _id: "demo-product-clarisea-gen3",
  slug: "clarisea-gen3",
  name: "ClariSea Gen 3",
  tagline: "The fleece filter that does more — clever, compact, and virtually maintenance-free.",
  body: pt(
    "ClariSea Gen 3 automatic fleece filters continuously remove waste, detritus, uneaten food, microalgae and other fine particles before they break down in your aquarium — no more filter socks, no more sock cleaning.",
    "Two sizes: the SK-3000 G3 handles up to 3,000 litres per hour (790 gal/h), the SK-5000 G3 up to 5,000 litres per hour (1,320 gal/h). Both fit freshwater and saltwater systems.",
    "A smart controller advances the fleece as it becomes dirty; audible and visual alarms cover end-of-roll, jams, overflow, float-switch and installation errors, and an integrated fail-safe overflow adds peace of mind.",
  ),
  category: "Filtration",
  sku: "SK-3000 G3 / SK-5000 G3",
  image: img("original/clarisea-unit-dark.jpg", { width: 880, height: 720 }),
  imageAlt: "ClariSea SK-5000 Gen 3 automatic fleece filter with two 40 m XL QuickChange rolls",
  gallery: [
    captioned("original/clarisea-sk3000.jpg", "ClariSea SK-3000 Gen 3", "SK-3000 G3 — up to 3,000 l/h"),
    captioned("original/clarisea-sk5000.jpg", "ClariSea SK-5000 Gen 3", "SK-5000 G3 — up to 5,000 l/h"),
    captioned("original/clarisea-body.jpg", "Fully pre-assembled ClariSea Gen 3 body", "Fully assembled body"),
    captioned("original/clarisea-rollers.jpg", "Top rollers with fleece guides", "Top rollers with fleece guides"),
    captioned("original/clarisea-inlet.jpg", "Universal inlet adaptor for 32 mm, 40 mm and 1\" pipework", "Universal inlet adaptor"),
  ],
  specs: [
    spec("Flow SK-3000 G3", "3,000", "l/h"),
    spec("Flow SK-5000 G3", "5,000", "l/h"),
    spec("Recommended tank SK-3000", "up to 600", "l"),
    spec("Recommended tank SK-5000", "up to 1,200", "l"),
    spec("Optimal water depth", "10", "cm"),
    spec("Submerged depth", "5–20", "cm"),
    spec("Inlet adaptor", "32 mm / 40 mm / 1\""),
    spec("Fleece roll", "40", "m"),
    spec("Roll life", "8–10", "weeks"),
    spec("Systems", "Freshwater & saltwater"),
  ],
  legacyUrl: "https://www.theaquariumsolution.com/product/3078/409",
  manualUrl: null,
  videoUrl: null,
};
demoProducts.push(clarisea);

export const rowaphos: ProductSummary = {
  _id: "demo-product-rowaphos",
  slug: "rowaphos",
  name: "RowaPhos",
  tagline: "The phosphate remover that means business — globally proven phosphate control at exceptional value for money.",
  body: pt(
    "RowaPhos is a unique ferric hydroxide material that removes phosphate and silicate from both freshwater and saltwater systems. It was originally patented and chemically engineered in Germany, and delivers the largest adsorption capacity of any commercial phosphate remover: 25 g of phosphate per kg in saltwater and 20 g per kg in freshwater.",
    "It keeps working at low concentrations, even below 0.05 ppm, and does not leach phosphate back into the system once saturated.",
    "Five sizes, from 100 ml up to a 5 kg commercial pack.",
  ),
  category: "Water chemistry",
  sku: "RP10 / RP25 / RP50 / RP100 / RP500KG",
  image: img("original/rowaphos-4-tub.png", { width: 600, height: 488 }),
  imageAlt: "RowaPhos phosphate remover in four pack sizes",
  gallery: [
    captioned("original/rowaphos-group.png", "The RowaPhos range, from 100 ml to the 5 kg commercial pack", "Five sizes"),
    captioned("original/rowaphos-media.png", "RowaPhos ferric hydroxide granules", "Ferric hydroxide media"),
    captioned("original/fmr75.jpg", "D-D FMR75 fluidised media reactor", "Best with the FMR75 reactor"),
  ],
  specs: [
    spec("Material", "Ferric hydroxide (patented, made in Germany)"),
    spec("Removes", "Phosphate (PO₄) and silicate"),
    spec("Adsorption capacity, saltwater", "25", "g PO₄/kg"),
    spec("Adsorption capacity, freshwater", "20", "g PO₄/kg"),
    spec("Effective down to", "< 0.05", "ppm PO₄"),
    spec("Recommended dose, saltwater", "25 g per 100", "l"),
    spec("Sizes", "100 ml · 250 ml · 500 ml · 1,000 ml · 5 kg"),
    spec("Systems", "Freshwater & saltwater"),
  ],
  legacyUrl: "https://www.theaquariumsolution.com/product/17/96",
  manualUrl: "https://www.theaquariumsolution.com/sites/default/files/downloads/What%20is%20Rowaphos%20_14.pdf",
  videoUrl: null,
};
demoProducts.push(rowaphos);

export const fmr75: ProductSummary = {
  _id: "demo-product-fmr75",
  slug: "fmr75",
  name: "FMR75",
  tagline: "The media reactor that ticks every box — plug and play, flexible to fit, at exceptional value for money.",
  body: pt(
    "The FMR75 fluidised media reactor fluidises a whole range of media in freshwater and saltwater aquariums: RowaPhos and other phosphate removers, bio pellets (up to 700 ml), carbon, and biological sand as a fluidised sand filter.",
    "A dished base spreads the flow through 360° with no dead spots, perforated plates above and below keep the media where it belongs, and the central feed tube stays put when the lid comes off — so topping up is simple.",
    "Two versions: the FMR75 reactor, and the FMR75 KIT with a 1,000 l/h feed pump. Both come with tubing, a non-return valve, a flow adjustment tap, two grades of media sponge and cable ties.",
  ),
  category: "Filtration",
  sku: "FMR75 / FMR75KIT",
  image: img("original/fmr75-kit.png", { width: 967, height: 1047 }),
  imageAlt: "D-D FMR75 fluidised media reactor with its box and the FMR75 KIT feed pump",
  gallery: [
    captioned("original/fmr75-reactor.png", "D-D FMR75 fluidised media reactor", "FMR75 — 128 × 94 × 440 mm"),
    captioned("original/fmr75-fittings.png", "FMR75 fittings: three lengths of clear tubing, a non-return valve, a flow adjustment tap and cable ties", "Everything you need to install it"),
    captioned("original/fmr75-kit-fittings.png", "FMR75 KIT: 1,000 l/h feed pump with tubing, non-return valve, flow tap and cable ties", "FMR75 KIT — feed pump included"),
  ],
  specs: [
    spec("Dimensions (incl. fittings and lid)", "128 × 94 × 440", "mm"),
    spec("Reaction tube outer diameter", "80", "mm"),
    spec("Tube height between perforated plates", "340", "mm"),
    spec("Hangs on glass up to", "25", "mm"),
    spec("Pipe", "17 mm OD × 14 mm ID"),
    spec("Hang-on height", "Made for a 15\" sump — stands in smaller, hangs on taller"),
    spec("Bio pellet capacity", "up to 700", "ml"),
    spec("Feed pump (FMR75 KIT only)", "1,000", "l/h"),
    spec("Pump size (H × W × L)", "100 × 60 × 90", "mm"),
    spec("Suitable for", "RowaPhos & phosphate removers · bio pellets · carbon · biological sand"),
    spec("Systems", "Freshwater & saltwater"),
  ],
  legacyUrl: "https://www.theaquariumsolution.com/products/fmr75-fluidised-reactors",
  manualUrl: "https://www.theaquariumsolution.com/sites/default/files/downloads/FMR-%2075%20Operating%20Instructions%20v2_0.pdf",
  videoUrl: null,
};
demoProducts.push(fmr75);
