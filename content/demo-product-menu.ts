/**
 * The global nav's Products menu in the resolved shape of SITE_SHELL_QUERY's
 * `productMenu`. Catalogue from the D-D product overview (dd-megamenu.html);
 * links go to the product page on theaquariumsolution.com, or to the landing
 * page here when there is one. Lines without their own page on the old site
 * link to their brand's product group. Order is the order editors see.
 */
import type { ProductMenuDocument, ProductMenuItem } from "@/blocks/types";
import { LEGACY_SITE_ORIGIN } from "@/lib/site";
import { link } from "./demo-helpers";

type Brand = ProductMenuItem["brand"];

const brand = (name: string, code: string, house = false): Brand => ({ _id: `brand-${slug(name)}`, name, code, house });

export const demoBrands: Brand[] = [
  brand("D-D", "D-D", true),
  brand("AquaIllumination", "AI"),
  brand("AutoAqua", "AutoAqua"),
  brand("Deltec", "Deltec"),
  brand("Jecod", "Jecod"),
  brand("Kamoer", "Kamoer"),
  brand("Polyplab", "Polyplab"),
  brand("Reef Zlements", "Reef Z."),
  brand("Rowa", "Rowa"),
];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** `path` is a landing page here (/en/…) or a path on the old site. */
function line(brandName: string, name: string, path: string, badge?: string): ProductMenuItem {
  const b = demoBrands.find((x) => x.name === brandName);
  if (!b) throw new Error(`Unknown brand ${brandName}`);
  return { _key: slug(name), name, href: path.startsWith("/en/") ? path : `${LEGACY_SITE_ORIGIN}${path}`, badge: badge ?? null, brand: b };
}

function group(title: string, items: ProductMenuItem[]) {
  return { _key: slug(title), title, items };
}

function category(title: string, groups: ReturnType<typeof group>[]) {
  return { _key: slug(title), title, groups };
}

export const demoProductMenu: ProductMenuDocument = {
  _id: "productMenu-en",
  label: "Products",
  allProductsLink: link("All products", LEGACY_SITE_ORIGIN),
  categories: [
    category("Aquariums", [
      group("Aqua-Pro", [
        line("D-D", "D-D AQUA-PRO Aquascaper Aquariums", "/products/d-d-aqua-pro-aquascaper-aquariums"),
        line("D-D", "D-D AQUA-PRO Freshwater Aquariums", "/product-groups/d-d-aqua-pro-aquariums"),
        line("D-D", "D-D AQUA-PRO Reef Aquariums", "/products/d-d-aqua-pro-reef-aquariums"),
        line("D-D", "D-D AQUA-PRO Reef Peninsula Aquariums", "/products/d-d-aqua-pro-reef-peninsula-aquariums"),
      ]),
      group("Reef-Pro", [
        line("D-D", "D-D REEF-PRO Aquariums", "/products/d-d-reef-pro-aquariums"),
      ]),
    ]),
    category("Lighting", [
      group("Mounting Systems", [
        line("D-D", "D-D Spektrum Mounting Systems", "/products/d-d-spektrum-mounting-systems"),
        line("D-D", "LED Hanging Rails & Wires", "/products/led-hanging-rails-wires"),
        line("AquaIllumination", "LED Mounting Systems", "/products/led-mounting-systems"),
      ]),
      group("Spektrum", [
        line("D-D", "D-D Spektrum 150 LED Lighting", "/products/d-d-spektrum-150-led-lighting"),
        line("D-D", "D-D Spektrum 90 LED Lighting", "/products/d-d-spektrum-90-led-lighting"),
      ]),
      group("Blade Series", [
        line("AquaIllumination", "AI Blade LED Lighting", "/products/ai-blade-led-lighting"),
      ]),
      group("Hydra Edge Series", [
        line("AquaIllumination", "AI Hydra Edge LED Lighting", "/products/ai-hydra-edge-led-lighting"),
      ]),
      group("Hydra/Prime Series", [
        line("AquaIllumination", "Aquaillumination LED Lighting", "/products/aquaillumination-led-lighting"),
      ]),
    ]),
    category("Pumps", [
      group("Return Pumps", [
        line("D-D", "D-D Funktion Pro 30", "/products/d-d-funktion-pro-30"),
        line("D-D", "D-D Funktion Return Pumps", "/products/d-d-funktion-return-pumps"),
        line("AquaIllumination", "AXIS Compact Pumps", "/products/axis-compact-pumps"),
        line("Deltec", "E-Flow Pumps", "/products/e-flow-pumps"),
        line("Jecod", "Jecod Return Pumps", "/products/jecod-return-pumps"),
      ]),
      group("Wave Pumps", [
        line("D-D", "D-D Funktion Wave Pumps", "/products/d-d-funktion-wave-pumps"),
        line("AquaIllumination", "NERO Wave Pumps", "/products/nero-wave-pumps"),
        line("AquaIllumination", "ORBIT Cross Flow Wave Pump", "/products/orbit-cross-flow-wave-pump"),
        line("Jecod", "Jecod Wave Pumps", "/products/jecod-wave-pumps"),
      ]),
      group("Dosing Pumps", [
        line("D-D", "P4 Connect/P4 Pro Connect/P1/P1 Pro", "/products/dosing-pumps"),
        line("AutoAqua", "AutoAqua Smart Dosers", "/product-groups/autoaqua"),
        line("Kamoer", "Kamoer FX-STP2 Stepper Motor Pump", "/products/kamoer-fx-stp2-stepper-motor-pump"),
      ]),
      group("Water Change Pumps", [
        line("Kamoer", "Kamoer X2SR Pro Water Change Pump", "/products/kamoer-x2sr-pro-water-change-pump"),
      ]),
    ]),
    category("Filtration & reactor media", [
      group("Filter Media", [
        line("D-D", "Media Bags", "/products/media-bags"),
        line("D-D", "Nutri-Fix Bio Pellets", "/product-groups/d-d-products"),
        line("Reef Zlements", "Activated Carbon", "/products/activated-carbon"),
        line("Rowa", "RowaCarbon Activated Carbon", "/products/rowacarbon-activated-carbon"),
        line("Rowa", "RowaLith Calcium Reactor Media", "/products/rowalith-calcium-reactor-media"),
        line("Rowa", "Rowaphos Phosphate Remover", "/en/rowaphos"),
      ]),
      group("Reactors", [
        line("D-D", "FMR75 Fluidised Reactors", "/en/fmr75"),
        line("Deltec", "Algae Reactor", "/product-groups/deltec-products"),
        line("Deltec", "Calcium Reactors", "/products/calcium-reactors"),
        line("Deltec", "Fluidised Reactors", "/products/fluidised-reactors"),
        line("Deltec", "Nitrate Filters", "/products/nitrate-filters"),
        line("Deltec", "TWIN-TECH Calcium Reactors", "/product-groups/deltec-products"),
      ]),
      group("Fleece Filters", [
        line("D-D", "ClariSea Fleece Filter Units", "/en/clarisea"),
      ]),
      group("Overflow & Weirs", [
        line("D-D", "UltraFlow Weir Comb", "/product/8127/286"),
      ]),
      group("UV Sterilisers", [
        line("D-D", "U.V. Steriliser Units", "/products/uv-steriliser-units"),
      ]),
      group("Dosing & Stirring", [
        line("Deltec", "Kalkwasser Stirrers", "/products/kalkwasser-stirrers"),
      ]),
      group("Protein Skimmers", [
        line("Deltec", "External Protein Skimmers", "/products/external-protein-skimmers"),
      ]),
    ]),
    category("Protein Skimmers", [
      group("Protein Skimmers", [
        line("Deltec", "Hang On Protein Skimmers", "/product-groups/deltec-products"),
        line("Deltec", "Internal Protein Skimmers", "/products/internal-protein-skimmers-0"),
      ]),
    ]),
    category("Controllers & Testing", [
      group("KH Manager", [
        line("D-D", "D-D KH Manager", "/products/d-d-kh-manager"),
        line("D-D", "D-D KH Manager - pH Control System", "/products/d-d-kh-manager-ph-control-system"),
        line("D-D", "D-D KH Manager E1 Expansion Box", "/products/d-d-kh-manager-e1-expansion-box"),
        line("D-D", "D-D KH Manager Test Reagent", "/products/d-d-kh-manager-test-reagent"),
      ]),
      group("Meters", [
        line("D-D", "TDS Measurement", "/products/tds-measurement"),
        line("AutoAqua", "AutoAqua Titanium TDS Meters", "/products/autoaqua-titanium-tds-meters"),
      ]),
      group("Temperature Control", [
        line("D-D", "Temperature Controllers", "/products/temperature-controllers"),
      ]),
      group("Test Equipment", [
        line("D-D", "True Seawater Refractometer", "/products/true-seawater-refractometer"),
      ]),
      group("ICP Testing", [
        line("Reef Zlements", "ICP Testing", "/products/icp-testing"),
      ]),
      group("Leak Detection", [
        line("AutoAqua", "AutoAqua Flood Guardian", "/products/autoaqua-flood-guardian"),
      ]),
    ]),
    category("ATO & Water change", [
      group("Automatic Top-Up (ATO)", [
        line("D-D", "Automatic Top-Up Units", "/products/automatic-top-units"),
        line("AutoAqua", "AutoAqua Smart ATO Nano", "/products/autoaqua-smart-ato-nano"),
      ]),
      group("Water Change", [
        line("AutoAqua", "AutoAqua Smart Auto Water Change Unit", "/products/autoaqua-smart-auto-water-change-unit"),
      ]),
    ]),
    category("Heating & Cooling", [
      group("Chillers", [
        line("D-D", "Refrigerant Chillers", "/products/refrigerant-chillers"),
      ]),
      group("Cooling Fans", [
        line("D-D", "Ocean Breeze Cooling Fans", "/product-groups/d-d-products"),
      ]),
      group("Heaters", [
        line("D-D", "Titanium Heaters", "/products/titanium-heaters"),
      ]),
    ]),
    category("Supplements", [
      group("Foundation elements", [
        line("Polyplab", "Polyplab One", "/products/polyplab-one"),
        line("Reef Zlements", "All-In-One Single Part Dosing", "/products/all-one-single-part-dosing"),
        line("Reef Zlements", "Complete, pHplus & Universal 2 Part Dosing", "/products/complete-phplus-universal-2-part-dosing"),
      ]),
      group("Coral Care", [
        line("Polyplab", "Coral & Fish Treatments", "/products/coral-fish-treatments"),
        line("Reef Zlements", "Coral Dip", "/products/coral-dip"),
      ]),
      group("Trace elements", [
        line("Polyplab", "Colours", "/products/colours"),
        line("Reef Zlements", "Trace Elements", "/products/trace-elements"),
      ]),
      group("Bacteria", [
        line("Polyplab", "RF-Genesis", "/products/rf-genesis"),
      ]),
      group("Buffers", [
        line("Reef Zlements", "KH Buffer", "/products/kh-buffer"),
      ]),
      group("Elements", [
        line("Reef Zlements", "Macro Elements", "/products/macro-elements"),
      ]),
      group("Nutrient Control", [
        line("Reef Zlements", "Nutrient Control & Amino Acids", "/products/nutrient-control-amino-acids"),
      ]),
    ]),
    category("Coral nutrition", [
      group("Coral Food", [
        line("Polyplab", "Reef-Roids Engineered Coral Food", "/products/reef-roids-engineered-coral-food"),
      ]),
    ]),
    category("Salt", [
      group("Marine Salt", [
        line("D-D", "H2Ocean Premium Reef Salts", "/products/h2ocean-premium-reef-salts"),
      ]),
    ]),
    category("Rock & Glues", [
      group("Glue", [
        line("D-D", "Aquascape Epoxy", "/products/aquascape-epoxy"),
        line("D-D", "D-D Marco Coralline Bonding Powder", "/products/d-d-marco-coralline-bonding-powder"),
        line("D-D", "D-D Marco Coralline Mortar Bonding Kit", "/products/d-d-marco-coralline-mortar-bonding-kit"),
        line("Polyplab", "Pro Glue", "/products/pro-glue"),
        line("Reef Zlements", "Frag Gel Glue", "/products/frag-gel-glue"),
      ]),
      group("MarcoRocks", [
        line("D-D", "D-D Marco Coralline Aquarium Rock", "/products/d-d-marco-coralline-aquarium-rock", "Ending"),
        line("D-D", "D-D Marco Coralline Colour Spray", "/products/d-d-marco-coralline-colour-spray"),
        line("D-D", "D-D Marco Coralline Frag Mount", "/products/d-d-marco-coralline-frag-mount"),
        line("D-D", "D-D Marco Coralline Nano Shelf Rock", "/products/d-d-marco-coralline-nano-shelf-rock"),
      ]),
    ]),
    category("Maintenance", [
      group("Glass cleaner", [
        line("D-D", "Bladerunner Glass/Acrylic Cleaner", "/products/bladerunner-glassacrylic-cleaner"),
        line("D-D", "EzeClean Equipment Cleaner", "/products/ezeclean-equipment-cleaner"),
        line("D-D", "MagScraper Glass Cleaners", "/products/magscraper-glass-cleaners"),
        line("D-D", "Tank Scrapers & Tools", "/product-groups/d-d-products"),
        line("Reef Zlements", "Clear View Glass Cleaner", "/products/clear-view-glass-cleaner"),
      ]),
      group("CO2 Equipment", [
        line("D-D", "CO2 Sets & Accessories", "/product-groups/d-d-products"),
      ]),
      group("RO Units", [
        line("D-D", "Reverse Osmosis & Spares", "/product-groups/d-d-products"),
      ]),
      group("Dosing & Stirring", [
        line("AutoAqua", "AutoAqua Smart Stir", "/product-groups/autoaqua"),
      ]),
    ]),
    category("Accessories", [
      group("Tank Covers", [
        line("D-D", "Jumpguard DIY Aquarium Covers", "/products/jumpguard-diy-aquarium-covers"),
        line("D-D", "Jumpguard Feeding Portal", "/products/jumpguard-feeding-portal"),
      ]),
      group("Viewing", [
        line("D-D", "Coral Colour Lens XL", "/products/coral-colour-lens-xl"),
        line("D-D", "Coral Viewing Sunglasses", "/products/coral-viewing-sunglasses"),
      ]),
    ]),
    category("Spare Parts", [
      group("Deltec Spares", [
        line("Deltec", "Deltec Spares U.K", "/products/deltec-spares-uk"),
      ]),
    ]),
  ],
};
