import { key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function animatedHeadlineDemo(input: {
  eyebrow?: string;
  headline: string;
  level?: "h1" | "h2";
}): BlockOf<"animatedHeadlineBlock"> {
  return {
    _key: key("animated-headline"),
    _type: "animatedHeadlineBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    level: input.level ?? "h2",
  };
}
