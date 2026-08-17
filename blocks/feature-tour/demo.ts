import { img, key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export type FeatureTourStepInput = {
  title: string;
  body?: string;
  image: string;
  imageAlt: string;
  stat?: string;
  statLabel?: string;
};

export function featureTourDemo(input: {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  steps?: FeatureTourStepInput[];
  tone?: "ink" | "paper";
} = {}): BlockOf<"featureTourBlock"> {
  const steps: FeatureTourStepInput[] = input.steps ?? [
    {
      title: "Eight colours, one optic",
      body: "Every LED cluster blends royal blue, violet, cyan, green, red and three whites through a single lens — no colour banding, no hot spots on the sand bed.",
      image: "spektrum-150-detail.jpg",
      imageAlt: "Close-up of the Spektrum 150 lens cluster",
      stat: "8",
      statLabel: "LED colours per optic",
    },
    {
      title: "Mount it your way",
      body: "Rim brackets, a hanging kit or a rail — the slim aluminium body sits flush and stays cool without a single fan.",
      image: "spektrum-150-mounted.jpg",
      imageAlt: "Spektrum 150 mounted above a reef tank",
      stat: "3.2 cm",
      statLabel: "Body height",
    },
    {
      title: "Colour corals were made for",
      body: "A full spectrum tuned to coral fluorescence pulls out pinks, oranges and greens that flat white light simply washes away.",
      image: "reef-corals.jpg",
      imageAlt: "Fluorescent SPS and LPS corals under Spektrum light",
      stat: "550",
      statLabel: "PAR at 30 cm",
    },
    {
      title: "From sunrise to moonlight",
      body: "Program a natural daily curve in the app — gentle ramps, midday peak, lunar phases — and the fish keep their rhythm.",
      image: "reef-fish.jpg",
      imageAlt: "Reef fish swimming beneath a Spektrum light schedule",
      stat: "24 h",
      statLabel: "Programmable schedule",
    },
  ];

  return {
    _key: key("feature-tour"),
    _type: "featureTourBlock",
    eyebrow: input.eyebrow ?? "Spektrum 150",
    headline: input.headline ?? "Built around the reef,\nnot the fixture",
    intro: input.intro ?? "Scroll through the details that make Spektrum different — from the optic to the schedule.",
    steps: steps.map((s) => ({
      _key: key("step"),
      _type: "featureTourStep",
      title: s.title,
      body: s.body,
      image: img(s.image),
      imageAlt: s.imageAlt,
      stat: s.stat,
      statLabel: s.statLabel,
    })),
    tone: input.tone ?? "ink",
  };
}
