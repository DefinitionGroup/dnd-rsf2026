import { key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

type StatInput = { value: string; prefix?: string; suffix?: string; label: string };

const CLARISEA_STATS: StatInput[] = [
  { value: "5,000", suffix: "l/h", label: "Flow rate of the SK-5000 Gen 3" },
  { value: "40", suffix: "m", label: "Fleece per roll — weeks of hands-off filtration" },
  { value: "8–10", suffix: "weeks", label: "Typical roll lifetime on a stocked reef" },
  { value: "32/40", suffix: 'mm + 1"', label: "Universal inlet adaptor fits standard plumbing" },
];

export function statStripDemo(
  input: {
    eyebrow?: string;
    headline?: string;
    stats?: StatInput[];
    tone?: "lime" | "ink" | "paper";
  } = {},
): BlockOf<"statStripBlock"> {
  return {
    _key: key("stat-strip"),
    _type: "statStripBlock",
    eyebrow: input.eyebrow ?? "ClariSea by the numbers",
    headline: input.headline,
    stats: (input.stats ?? CLARISEA_STATS).map((s) => ({
      _type: "stat" as const,
      _key: key("stat"),
      value: s.value,
      prefix: s.prefix,
      suffix: s.suffix,
      label: s.label,
    })),
    tone: input.tone ?? "lime",
  };
}
