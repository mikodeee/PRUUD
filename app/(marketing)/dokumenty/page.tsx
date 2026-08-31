import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Section } from "@/components/sections/ProductLayout";
import { SectionHeading } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Dokumenty",
  description:
    "Obchodné podmienky, cenník, zásady ochrany osobných údajov a reklamačný poriadok na stiahnutie.",
};

const groups = [
  {
    id: "zmluvne",
    title: "Zmluvné dokumenty",
    docs: [
      ["Všeobecné obchodné podmienky", "Znenie pre spotrebiteľov"],
      ["Všeobecné obchodné podmienky", "Znenie pre podnikateľov a obce"],
      ["Vzor zmluvy o zdieľaní elektriny", "Vrátane príloh"],
    ],
  },
  {
    id: "cennik",
    title: "Cenníky",
    docs: [
      ["Cenník služieb", "Aktuálne znenie"],
      ["Archív cenníkov", "Predchádzajúce znenia"],
    ],
  },
  {
    id: "ochrana",
    title: "Ochrana údajov",
    docs: [
      ["Zásady ochrany osobných údajov", "Informácie podľa GDPR"],
      ["Informácia o spracúvaní meraných dát", "15-minútové intervaly"],
    ],
  },
  {
    id: "reklamacie",
    title: "Reklamácie",
    docs: [["Reklamačný poriadok", "Postup a lehoty"]],
  },
];

export default function DokumentyPage() {
  return (
    <Section>
      <p className="claim text-xs text-gold-600">Dokumenty</p>
      <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
        Dokumenty na stiahnutie
      </h1>

      <div className="mt-8 rounded-card border border-gold-300 bg-gold-50 p-6">
        <p className="leading-relaxed text-gold-900">
          <strong className="font-semibold">Pripravujeme.</strong> Právne
          dokumenty pripravuje advokátska kancelária. Do ich schválenia je
          zoznam iba prehľadom toho, čo bude k dispozícii — súbory zatiaľ
          nie sú na stiahnutie.
        </p>
      </div>

      <div className="mt-14 space-y-14">
        {groups.map((group) => (
          <section key={group.id} id={group.id}>
            <SectionHeading title={group.title} />
            <ul className="mt-8 divide-y divide-ink-200 border-y border-ink-200">
              {group.docs.map(([title, note], i) => (
                <li
                  key={`${title}-${i}`}
                  className="flex items-center gap-5 py-5"
                >
                  <FileText
                    size={22}
                    className="shrink-0 text-ink-400"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-ink-950">{title}</p>
                    <p className="text-sm text-ink-500">{note}</p>
                  </div>
                  <span className="text-sm text-ink-400">Pripravuje sa</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  );
}
