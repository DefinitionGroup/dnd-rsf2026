import Image from "next/image";

/**
 * The real D-D wordmark (white-only SVG from theaquariumsolution.com) — lives on
 * the dark global nav. `tone="dark"` inverts it for light grounds (footer).
 */
export default function Logo({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/original/dd-logo.svg"
        alt=""
        width={50}
        height={32}
        className={`h-8 w-auto ${tone === "dark" ? "invert" : ""}`}
        priority
        unoptimized
      />
    </span>
  );
}
