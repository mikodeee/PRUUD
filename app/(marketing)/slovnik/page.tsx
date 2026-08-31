import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/sections/ProductLayout";
import { glossary } from "@/lib/content/glossary";

export const metadata: Metadata = {
  title: "Slovník pojmov",
  description:
    "EIC kód, EDC, alokačný kľúč, IMS. Vysvetlenie pojmov, na ktoré pri zdieľaní elektriny narazíte.",
};

export default function SlovnikPage() {
  return (
    <Section>
      <p className="claim text-xs text-gold-600">Slovník</p>
      <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
        Slovník pojmov
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
        Energetika si potrpí na skratky. Tu je preklad tých, na ktoré pri
        zdieľaní narazíte najčastejšie.
      </p>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {glossary.map((term) => (
          <Link
            key={term.slug}
            href={`/slovnik/${term.slug}`}
            className="group rounded-card border border-ink-200 bg-white p-6 transition-all hover:border-gold-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <h2 className="font-display text-lg font-semibold text-ink-950 group-hover:text-gold-700">
              {term.term}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-600">{term.short}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
