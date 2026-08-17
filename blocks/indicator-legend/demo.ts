import { key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

type SignalInput = {
  name: string;
  ledColor?: "blue" | "red" | "blueRed" | "off";
  pattern?: "solid" | "flash" | "pulse";
  sound?: string;
  meaning?: string;
  action?: string;
  severity?: "info" | "warning" | "alarm";
};

export type IndicatorLegendDemoInput = {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  signals?: SignalInput[];
  deviceLabel?: string;
};

/** ClariSea Gen 3 smart-controller states, from the manufacturer's manual. */
const DEFAULT_SIGNALS: SignalInput[] = [
  {
    name: "Normal operation",
    ledColor: "blue",
    pattern: "solid",
    sound: "None",
    meaning: "The unit is running: the float sits low and the fleece advances automatically as it loads.",
    action: "Nothing to do — enjoy the clear water.",
    severity: "info",
  },
  {
    name: "Roll jam / float switch activated",
    ledColor: "red",
    pattern: "flash",
    sound: "Beep every 5 s",
    meaning: "The float has stayed up: fleece is not advancing, or the water path is obstructed.",
    action: "Check the fleece path and float, then press play to resume.",
    severity: "alarm",
  },
  {
    name: "Roll empty (8+ h)",
    ledColor: "blueRed",
    pattern: "flash",
    sound: "Beep every 2 s",
    meaning: "The roll has been used up for more than eight hours; water is bypassing unfiltered.",
    action: "Fit a new 40 m roll — the unit stays in the sump while you change it.",
    severity: "warning",
  },
  {
    name: "Overflow protection",
    ledColor: "red",
    pattern: "flash",
    sound: "Continuous beep",
    meaning: "The fail-safe overflow is passing water because the fleece cannot keep up with the inflow.",
    action: "Fail-safe overflow is passing water; check the bypass and reduce the flow into the unit.",
    severity: "alarm",
  },
  {
    name: "Installation error (48 h)",
    ledColor: "red",
    pattern: "flash",
    sound: "None / periodic",
    meaning: "The unit has not advanced fleece at all in the 48 hours since installation.",
    action: "Unit not advancing since install — check power and that the fleece is seated on the rollers.",
    severity: "warning",
  },
  {
    name: "Manual advance",
    ledColor: "blue",
    pattern: "pulse",
    sound: "None",
    meaning: "The advance button is held: the motor winds fleece forward while pressed.",
    action: "Release the button when clean fleece covers the filter window.",
    severity: "info",
  },
];

export function indicatorLegendDemo(input: IndicatorLegendDemoInput = {}): BlockOf<"indicatorLegendBlock"> {
  return {
    _key: key("legend"),
    _type: "indicatorLegendBlock",
    eyebrow: input.eyebrow ?? "Smart controller",
    headline: input.headline ?? "What the LED\nis telling you",
    intro: input.intro ?? "The ClariSea Gen 3 controller uses one LED and a beeper to report its state. Pick a signal to see what it means and what to do.",
    signals: (input.signals ?? DEFAULT_SIGNALS).map((s) => ({
      _type: "signal",
      _key: key("signal"),
      name: s.name,
      ledColor: s.ledColor ?? "blue",
      pattern: s.pattern ?? "solid",
      sound: s.sound,
      meaning: s.meaning,
      action: s.action,
      severity: s.severity ?? "info",
    })),
    deviceLabel: input.deviceLabel ?? "ClariSea smart controller",
  };
}
