import type { Metadata } from "next";
import { Section } from "@/components/sections/ProductLayout";
import { ButtonLink } from "@/components/ui/Button";
import { FaqSearch } from "@/components/sections/FaqSearch";
import { faqItems } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "Časté otázky",
  description:
    "Odpovede na najčastejšie otázky o zdieľaní elektriny — od registrácie po faktúry a ukončenie zmluvy.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="claim text-xs text-gold-600">Podpora</p>
      <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
        Časté otázky
      </h1>

      <div className="mt-12 max-w-3xl">
        <FaqSearch />
      </div>

      <div className="mt-16 max-w-3xl rounded-card border border-ink-200 bg-white p-8">
        <h2 className="font-display text-lg font-semibold text-ink-950">
          Nenašli ste odpoveď?
        </h2>
        <p className="mt-3 leading-relaxed text-ink-600">
          Napíšte nám svoju situáciu a odpovieme do jedného pracovného dňa.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <ButtonLink href="/kontakt">Napísať správu</ButtonLink>
          <ButtonLink href="/slovnik" variant="ghost">
            Slovník pojmov
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
