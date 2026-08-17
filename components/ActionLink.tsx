import Link from "next/link";
import { stegaClean } from "next-sanity";

export type LinkLike = { label?: string | null; href?: string | null } | null | undefined;

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" className="shrink-0">
      <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function External() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" className="shrink-0">
      <path d="M4 2.5h5.5V8M9.5 2.5 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const icon = variant === "text" ? <Chevron /> : external ? <External /> : null;

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
