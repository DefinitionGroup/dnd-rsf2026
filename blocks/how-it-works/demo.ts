import { img, key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

type StepInput = { title: string; body?: string; image?: string; imageAlt?: string; durationSeconds?: number };

const CLARISEA_STEPS: StepInput[] = [
  {
    title: "Water enters",
    body: "Sump water flows in through the universal inlet adaptor — 32 mm, 40 mm or 1\" hose and pipe fit without extra fittings.",
    image: "original/clarisea-inlet.jpg",
    imageAlt: "ClariSea universal inlet adaptor connected to a return pipe",
  },
  {
    title: "Fleece catches particles",
    body: "Waste, detritus, uneaten food and free-floating microalgae are trapped on the fleece before they can break down and load the water.",
    image: "original/clarisea-rollers.jpg",
    imageAlt: "Close-up of the ClariSea fleece rollers with trapped particles",
  },
  {
    title: "Float rises as fleece clogs",
    body: "As the fleece loads up, water backs up in the inlet chamber and lifts the float — the signal that a fresh section is needed.",
    image: "original/clarisea-fleece-holder.jpg",
    imageAlt: "ClariSea Gen 3 sitting in a reef sump with the water level rising",
  },
  {
    title: "Smart controller advances the fleece",
    body: "The controller winds on a clean stretch automatically — or at the push of a button — so used fleece rolls neatly onto the take-up spool.",
    image: "original/clarisea-motor.jpg",
    imageAlt: "ClariSea Gen 3 smart controller with its single push button",
  },
  {
    title: "Blue LED = all good",
    body: "A steady blue light means the filter is running. Alarms flag end-of-roll, jams and overflow long before they become a problem.",
    image: "original/clarisea-body.jpg",
    imageAlt: "Blue status LED glowing on the ClariSea controller",
  },
];

export function howItWorksDemo(
  input: {
    eyebrow?: string;
    headline?: string;
    intro?: string;
    steps?: StepInput[];
    autoplay?: boolean;
    tone?: "paper" | "ink";
  } = {},
): BlockOf<"howItWorksBlock"> {
  return {
    _key: key("how-it-works"),
    _type: "howItWorksBlock",
    eyebrow: input.eyebrow ?? "How it works",
    headline: input.headline ?? "Five steps to\ncrystal-clear water",
    intro:
      input.intro ??
      "ClariSea Gen 3 turns mechanical filtration into a hands-off routine: water in, particles out, fleece advanced automatically.",
    steps: (input.steps ?? CLARISEA_STEPS).map((s) => ({
      _type: "howItWorksStep" as const,
      _key: key("step"),
      title: s.title,
      body: s.body,
      image: s.image ? img(s.image) : null,
      imageAlt: s.imageAlt,
      durationSeconds: s.durationSeconds ?? 6,
    })),
    autoplay: input.autoplay ?? true,
    tone: input.tone ?? "paper",
  };
}
