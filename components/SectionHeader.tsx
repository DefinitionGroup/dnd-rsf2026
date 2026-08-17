export default function SectionHeader({
  eyebrow,
  headline,
  intro,
  align = "left",
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string | null;
  headline?: string | null;
  intro?: string | null;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  if (!eyebrow && !headline && !intro) return null;
  return (
    <header className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      {headline && <Tag className="whitespace-pre-line">{headline}</Tag>}
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </header>
  );
}
