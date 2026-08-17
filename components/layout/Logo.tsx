/** Wordmark placeholder until the client supplies dark/light-safe logo files. Mark = the D-D monogram. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 leading-none ${className}`} aria-hidden="true">
      <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-lime text-ink" style={{ fontVariationSettings: '"wdth" 80' }}>
        <span className="text-[0.8rem] font-bold tracking-tight">D‑D</span>
      </span>
      <span className="text-[0.95rem] font-semibold tracking-[-0.01em]">The Aquarium Solution</span>
    </span>
  );
}
