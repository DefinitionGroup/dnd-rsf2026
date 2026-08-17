import type { ReactNode } from "react";

/**
 * The one authored scroll motion: rise-in. `RiseObserver` (mounted once in the
 * site layout) toggles `.is-in`; CSS owns the transition. Server component.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** stagger in ms */
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "figure";
}) {
  const T = Tag as "div";
  return (
    <T className={`rise ${className}`.trim()} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </T>
  );
}
