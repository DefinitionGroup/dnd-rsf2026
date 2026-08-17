import Link from "next/link";
import { stegaClean } from "next-sanity";

export type LinkLike = { label?: string | null; href?: string | null } | null | undefined;

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width="11" height="11" className="shrink-0">
      <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Apple pill grammar: primary = filled (the accent's only home), secondary =
 * outlined (always paired with a primary), text = ghost link with chevron.
 */
export default function ActionLink({
  link,
  variant = "primary",
  size = "md",
  className = "",
}: {
  link: LinkLike;
  variant?: "primary" | "secondary" | "text";
  size?: "md" | "sm";
  className?: string;
}) {
  if (!link?.href || !link.label) return null;
  const href = stegaClean(link.href);
  const classes = `action-link action-link--${variant} ${size === "sm" ? "action-link--small" : ""} ${className}`.trim();
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const icon = variant === "text" ? <Chevron /> : null;

  if (external) {
    return (
      <a className={classes} href={href} rel="noopener" target={href.startsWith("http") ? "_blank" : undefined}>
        <span>{link.label}</span>
        {icon}
      </a>
    );
  }
  return (
    <Link className={classes} href={href}>
      <span>{link.label}</span>
      {icon}
    </Link>
  );
}
