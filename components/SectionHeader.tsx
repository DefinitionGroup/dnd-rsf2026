/**
 * Apple-architecture section header: centered, stacked, symmetric.
 * Optional eyebrow (small lime pill) + headline (heading 40/600) + optional
 * whisper subhead (300 weight). The eyebrow also labels the product bar's
 * jump link (see PageBuilder).
 */
export default function SectionHeader({
  eyebrow,
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
  if (!eyebrow && !headline && !intro) return null;
  const center = align === "center";
  return (
    <header className={`rise container-text ${center ? "text-center" : ""} ${className}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      {headline && (
        <Tag className={`whitespace-pre-line ${size === "md" ? "display-md" : ""} ${center ? "mx-auto" : ""} max-w-[24ch]`}>{headline}</Tag>
      )}
      {intro && <p className={`whisper ${headline ? "mt-3" : ""} ${center ? "mx-auto" : ""} max-w-[42rem]`}>{intro}</p>}
    </header>
  );
}
