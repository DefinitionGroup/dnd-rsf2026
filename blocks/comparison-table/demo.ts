import { key, link } from "@/content/demo-helpers";
import { funktionPump, khManager, spektrum150 } from "@/content/demo-products";
import type { BlockOf, ProductSummary } from "@/blocks/types";

export type ComparisonColumnInput = {
  title: string;
  subtitle?: string;
  product?: ProductSummary | null;
  highlight?: boolean;
  cta?: { label: string; href: string };
};

export type ComparisonRowInput = {
  label: string;
  hint?: string;
  /** One value per column, in order. `yes`/`no` → icons, `—` → n/a, anything else → text. */
  cells: string[];
};

export function comparisonTableDemo(input: {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  rowHeader?: string;
  columns?: ComparisonColumnInput[];
  rows?: ComparisonRowInput[];
  footnote?: string;
} = {}): BlockOf<"comparisonTableBlock"> {
  const columns: ComparisonColumnInput[] = input.columns ?? [
    {
      title: "Spektrum 150",
      subtitle: "Full-spectrum reef LED",
      product: spektrum150,
      highlight: true,
      cta: { label: "Explore Spektrum", href: "/products/spektrum-150" },
    },
    {
      title: "Funktion Return",
      subtitle: "DC return pump",
      product: funktionPump,
      cta: { label: "Explore Funktion", href: "/products/funktion-return-pump" },
    },
    {
      title: "KH Manager",
      subtitle: "Alkalinity monitor & doser",
      product: khManager,
      cta: { label: "Explore KH Manager", href: "/products/kh-manager" },
    },
  ];

  const rows: ComparisonRowInput[] = input.rows ?? [
    { label: "App control", hint: "iOS and Android, cloud sync", cells: ["yes", "yes", "yes"] },
    { label: "Programmable schedule", hint: "Daily curve, seasons, lunar phases", cells: ["yes", "yes", "—"] },
    { label: "Silent operation", cells: ["Passive cooling", "< 30 dB", "Peristaltic pump"] },
    { label: "Power draw", cells: ["150 W", "18–65 W", "5 W"] },
    { label: "Feed / maintenance mode", cells: ["no", "yes", "yes"] },
    { label: "Dry-run protection", cells: ["—", "yes", "yes"] },
    { label: "Automatic alkalinity dosing", cells: ["no", "no", "yes"] },
    { label: "Warranty", cells: ["3 years", "2 years", "2 years"] },
  ];

  return {
    _key: key("comparison"),
    _type: "comparisonTableBlock",
    eyebrow: input.eyebrow ?? "Compare",
    headline: input.headline ?? "Which piece of the reef\nsystem do you need first?",
    intro: input.intro ?? "Light, flow and chemistry — every D-D product talks to the same app. Here is how the three flagships stack up.",
    rowHeader: input.rowHeader ?? "Feature",
    columns: columns.map((c) => ({
      _key: key("col"),
      _type: "comparisonColumn",
      title: c.title,
      subtitle: c.subtitle,
      product: c.product ?? null,
      highlight: c.highlight ?? false,
      cta: c.cta ? link(c.cta.label, c.cta.href) : undefined,
    })),
    rows: rows.map((r) => ({
      _key: key("row"),
      _type: "comparisonRow",
      label: r.label,
      hint: r.hint,
      cells: r.cells,
    })),
    footnote: input.footnote ?? "Specifications are typical values measured at 25 °C. Power draw depends on the selected schedule and flow setting.",
  };
}
