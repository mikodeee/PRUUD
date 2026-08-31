import { cn } from "@/lib/utils";

/*
 * Wordmark PRUUD podľa design manuálu: „PR" a „D" v ink, „UU" v zlatej,
 * medzi dvoma U je znak zdieľania (blesk medzi dvoma uzlami).
 *
 * Wordmark je zostavený zo živého textu, nie z rastrového loga — zostáva ostrý
 * v každej veľkosti a prispôsobí sa tmavému aj svetlému podkladu.
 * Po dodaní vektorového loga (SVG) stačí vymeniť vnútro tohto komponentu.
 */

type LogoProps = {
  /** Zobrazí claim „Energia, ktorá spája" pod wordmarkom. */
  withTagline?: boolean;
  /** Na tmavom podklade sa „PR"/„D" prepnú do bielej. */
  variant?: "light" | "dark";
  className?: string;
};

function SharingGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      className={cn("inline-block h-[0.62em] w-auto", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="3" cy="12" r="3" fill="currentColor" />
      <circle cx="37" cy="12" r="3" fill="currentColor" />
      <path
        d="M6 12h7M27 12h7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M23 2 14 14h5l-2 8 9-12h-5l2-8Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  withTagline = false,
  variant = "light",
  className,
}: LogoProps) {
  const inkClass = variant === "dark" ? "text-white" : "text-ink-950";

  return (
    <span className={cn("inline-flex flex-col items-center", className)}>
      <span
        className={cn(
          "font-display text-[1.6em] font-semibold leading-none tracking-[-0.02em]",
          inkClass,
        )}
      >
        <span>PR</span>
        <span className="text-gold-500">U</span>
        <SharingGlyph className="mx-[0.02em] mb-[0.1em] align-middle text-gold-500" />
        <span className="text-gold-500">U</span>
        <span>D</span>
      </span>
      {withTagline && (
        <span
          className={cn(
            "claim mt-[0.5em] flex w-full items-center gap-[0.6em] text-[0.44em] whitespace-nowrap",
            variant === "dark" ? "text-white/80" : "text-ink-700",
          )}
        >
          <span className="h-px flex-1 bg-gold-500" aria-hidden="true" />
          Energia, ktorá spája
          <span className="h-px flex-1 bg-gold-500" aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
