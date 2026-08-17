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
  image: img("original/clarisea-sk5000-rolls.png", { width: 1055, height: 1058 }),
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
