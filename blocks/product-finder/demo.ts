import { key, link } from "@/content/demo-helpers";
import { clarisea } from "@/content/demo-products";
import type { BlockOf, ProductSummary } from "@/blocks/types";

type Rule = NonNullable<BlockOf<"productFinderBlock">["rules"]>[number];
type RuleProduct = Rule["product"];

function ruleProduct(p: ProductSummary | undefined | null): RuleProduct {
  if (!p) return null;
  return { _id: p._id, slug: p.slug, name: p.name, image: p.image };
}

export type ProductFinderDemoInput = {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  volumeLabel?: string;
  volumeMin?: number;
  volumeMax?: number;
  volumeDefault?: number;
  loadLabel?: string;
  loadOptions?: { label: string; factor: number; rollFactor: number }[];
  rules?: {
    maxEffectiveVolume?: number;
    resultTitle: string;
    resultBody?: string;
    flowLph?: number;
    rollWeeks?: number;
    product?: ProductSummary | null;
    cta?: { label: string; href: string };
  }[];
  resultLabel?: string;
  rollLifeLabel?: string;
  footnote?: string;
};

const DEFAULT_LOAD: NonNullable<ProductFinderDemoInput["loadOptions"]> = [
  { label: "Light", factor: 1, rollFactor: 1.15 },
  { label: "Normal", factor: 1, rollFactor: 1 },
  { label: "Heavy", factor: 1.3, rollFactor: 0.75 },
];

const DEFAULT_RULES: NonNullable<ProductFinderDemoInput["rules"]> = [
  {
    maxEffectiveVolume: 600,
    resultTitle: "ClariSea SK-3000 G3",
    resultBody: "The compact Gen 3 unit for sumps up to 600 l effective volume — silent, self-cleaning fleece filtration with the smart controller built in.",
    flowLph: 3000,
    rollWeeks: 9,
    product: clarisea,
    cta: { label: "Find a stockist", href: "https://www.theaquariumsolution.com/stockists" },
  },
  {
    maxEffectiveVolume: 1200,
    resultTitle: "ClariSea SK-5000 G3",
    resultBody: "More flow and a wider fleece path for larger reef systems up to 1,200 l effective volume.",
    flowLph: 5000,
    rollWeeks: 9,
    product: clarisea,
    cta: { label: "Find a stockist", href: "https://www.theaquariumsolution.com/stockists" },
  },
  {
    resultTitle: "Two SK-5000 G3 units or a Deltec solution — ask us",
    resultBody: "Systems this size are best run on paired units or a Deltec fleece filter. Tell us about your sump and flow and we will spec it with you.",
    cta: { label: "Talk to us", href: "/en/contact" },
  },
];

export function productFinderDemo(input: ProductFinderDemoInput = {}): BlockOf<"productFinderBlock"> {
  return {
    _key: key("finder"),
    _type: "productFinderBlock",
    eyebrow: input.eyebrow ?? "Which ClariSea?",
    headline: input.headline ?? "Find the right\nfleece filter",
    intro: input.intro ?? "Tell us your aquarium volume and how heavily you feed — we'll point you to the ClariSea Gen 3 that fits and how long a roll should last.",
    volumeLabel: input.volumeLabel ?? "Aquarium volume",
    volumeMin: input.volumeMin ?? 50,
    volumeMax: input.volumeMax ?? 1500,
    volumeDefault: input.volumeDefault ?? 400,
    loadLabel: input.loadLabel ?? "Stocking / feeding",
    loadOptions: (input.loadOptions ?? DEFAULT_LOAD).map((o) => ({
      _type: "loadOption",
      _key: key("load"),
      label: o.label,
      factor: o.factor,
      rollFactor: o.rollFactor,
    })),
    rules: (input.rules ?? DEFAULT_RULES).map((r) => ({
      _type: "finderRule",
      _key: key("rule"),
      maxEffectiveVolume: r.maxEffectiveVolume,
      resultTitle: r.resultTitle,
      resultBody: r.resultBody,
      flowLph: r.flowLph,
      rollWeeks: r.rollWeeks,
      product: ruleProduct(r.product),
      cta: r.cta ? link(r.cta.label, r.cta.href) : undefined,
    })),
    resultLabel: input.resultLabel ?? "Our recommendation",
    rollLifeLabel: input.rollLifeLabel ?? "Expected roll life",
    footnote: input.footnote ?? "Roll life is a guide only — nutrient input, sump layout and stocking all change how quickly fleece clogs. Heavier feeders should keep a spare roll on the shelf.",
  };
}
