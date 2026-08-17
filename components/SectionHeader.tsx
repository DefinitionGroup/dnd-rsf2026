/**
 * Section header — headline + lead. The `eyebrow` field is kept in the content
 * model but is NOT rendered above the heading (it feeds the in-page product bar
 * as the section's jump-link label instead; see PageBuilder/ProductBar).
 */
export default function SectionHeader({
  headline,
  intro,
  align = "left",
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
  return (
    <header className={`rise max-w-[46rem] ${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {headline && <Tag className={`whitespace-pre-line max-w-[20ch] ${align === "center" ? "mx-auto" : ""} ${size === "md" ? "display-md" : ""}`}>{headline}</Tag>}
      {intro && <p className={`lead ${headline ? "mt-4" : ""} max-w-[36rem] ${align === "center" ? "mx-auto" : ""}`}>{intro}</p>}
    </header>
  );
}
