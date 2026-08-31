import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Section } from "@/components/sections/ProductLayout";

/** Spoločný rám pre právne stránky vrátane upozornenia na rozpracovanosť. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <Section>
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <p className="mt-4 text-sm text-ink-500">
          Účinné od {updated}
        </p>

        <div className="mt-8 flex items-start gap-3 rounded-card border border-gold-300 bg-gold-50 p-6">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-gold-700" aria-hidden="true" />
          <p className="leading-relaxed text-gold-900">
            <strong className="font-semibold">Pracovná verzia.</strong> Tento
            dokument je zatiaľ osnovou, ktorá vymedzuje štruktúru a rozsah.
            Záväzné znenie pripraví advokátska kancelária pred spustením
            služby.
          </p>
        </div>

        <div className="mt-12 space-y-10">{children}</div>
      </div>
    </Section>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-ink-950">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-ink-700">
        {children}
      </div>
    </section>
  );
}
