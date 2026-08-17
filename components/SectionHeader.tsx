/**
 * Apple-architecture section header: centered, stacked, symmetric.
 * Headline (heading 40/600) + optional whisper subhead (300 weight).
 * `eyebrow` is accepted for API stability but never rendered above the heading
 * (it labels the product bar's jump link instead).
 */
export default function SectionHeader({
  headline,
  intro,
  align = "center",
  as: Tag = "h2",
  size = "lg",
  className = "",
}: {
  eyebrow?: string | null;
  headline?: string | null;
  intro?: string | null;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md";
  className?: string;
}) {
  if (!headline && !intro) return null;
  const center = align === "center";
  return (
    <header className={`rise container-text ${center ? "text-center" : ""} ${className}`}>
      {headline && (
        <Tag className={`whitespace-pre-line ${size === "md" ? "display-md" : ""} ${center ? "mx-auto" : ""} max-w-[24ch]`}>{headline}</Tag>
      )}
      {intro && <p className={`whisper ${headline ? "mt-3" : ""} ${center ? "mx-auto" : ""} max-w-[42rem]`}>{intro}</p>}
    </header>
  );
}
