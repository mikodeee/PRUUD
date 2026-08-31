import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/sections/ProductLayout";
import { getTerm, glossary } from "@/lib/content/glossary";

export function generateStaticParams() {
  return glossary.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/slovnik/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return {};
  return { title: term.term, description: term.short };
}

export default async function TermPage({ params }: PageProps<"/slovnik/[slug]">) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();

  const related = (term.related ?? [])
    .map((s) => getTerm(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
  };

  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl">
        <Link
          href="/slovnik"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Späť na slovník
        </Link>

        <h1 className="mt-10 font-display text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
          {term.term}
        </h1>
        <p className="mt-4 text-xl leading-relaxed text-ink-600">{term.short}</p>
        <p className="mt-8 text-lg leading-relaxed text-ink-700">
          {term.definition}
        </p>

        {related.length > 0 && (
          <div className="mt-14 border-t border-ink-200 pt-10">
            <h2 className="claim text-xs text-gold-600">Súvisiace pojmy</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/slovnik/${r.slug}`}
                    className="block rounded-lg border border-ink-200 bg-white p-4 transition-colors hover:border-gold-300"
                  >
                    <span className="font-medium text-ink-950">{r.term}</span>
                    <span className="mt-1 block text-sm text-ink-600">
                      {r.short}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
