/** Placeholder wordmark (the brand's SVG logo is white-only; swap in when the asset is supplied). */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display uppercase leading-none ${className}`} aria-hidden="true">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-lime text-ink text-lg font-bold">D‑D</span>
      <span className="text-sm tracking-[0.18em]">
        The Aquarium
        <br />
        Solution
      </span>
    </span>
  );
}
