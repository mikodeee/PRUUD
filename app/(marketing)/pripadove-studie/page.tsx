import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/sections/ProductLayout";
import { getPosts } from "@/lib/content/mdx";

export const metadata: Metadata = {
  title: "Prípadové štúdie",
  description:
    "Konkrétne čísla z prevádzky: obce, školy a domácnosti, ktoré zdieľanie elektriny už používajú.",
};

export default async function PripadoveStudiePage() {
  const studies = await getPosts("pripadove-studie");

  return (
    <Section>
      <p className="claim text-xs text-gold-600">Prípadové štúdie</p>
      <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
        Ako to vyzerá v prevádzke
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
        Merateľné výsledky namiesto sľubov. Každá štúdia obsahuje východiskovú
        situáciu, riešenie a čísla po roku prevádzky.
      </p>

      <div className="mt-14 space-y-6">
        {studies.map((study) => (
          <Link
            key={study.slug}
            href={`/pripadove-studie/${study.slug}`}
            className="group grid gap-8 rounded-card border border-ink-200 bg-white p-8 transition-all hover:border-gold-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 md:grid-cols-[1fr_auto] md:p-10"
          >
            <div>
              {study.location && (
                <p className="text-sm text-ink-500">{study.location}</p>
              )}
              <h2 className="mt-2 font-display text-2xl leading-snug font-semibold text-ink-950 group-hover:text-gold-700">
                {study.title}
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-600">
                {study.description}
              </p>
            </div>
            <div className="flex shrink-0 gap-8 border-ink-200 md:flex-col md:justify-center md:border-l md:pl-10">
              {study.savings && (
                <div>
                  <p className="font-display text-2xl font-semibold text-gold-600">
                    {study.savings}
                  </p>
                  <p className="text-sm text-ink-500">úspora</p>
                </div>
              )}
              {study.volume && (
                <div>
                  <p className="font-display text-2xl font-semibold text-ink-950">
                    {study.volume}
                  </p>
                  <p className="text-sm text-ink-500">zdieľané</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
