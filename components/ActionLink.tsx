import Link from "next/link";
import { stegaClean } from "next-sanity";

export type LinkLike = { label?: string | null; href?: string | null } | null | undefined;

export default function ActionLink({
  link,
  variant = "primary",
  className = "",
}: {
  link: LinkLike;
  variant?: "primary" | "secondary" | "text";
  className?: string;
}) {
  if (!link?.href || !link.label) return null;
  const href = stegaClean(link.href);
  const classes = `action-link action-link--${variant} ${className}`.trim();
  const external = /^(https?:|mailto:|tel:)/.test(href);

  if (external) {
    return (
      <a className={classes} href={href} rel="noopener" target={href.startsWith("http") ? "_blank" : undefined}>
        <span>{link.label}</span>
        <span aria-hidden="true">↗</span>
      </a>
    );
  }
  return (
    <Link className={classes} href={href}>
      <span>{link.label}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
