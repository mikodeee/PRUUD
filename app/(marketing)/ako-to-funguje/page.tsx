import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/sections/ProductLayout";
import { EnergyFlow } from "@/components/sections/EnergyFlow";
import { Accordion } from "@/components/ui/Accordion";
import { faqItems } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "Ako funguje zdieľanie elektriny",
  description:
    "Vysvetlenie zdieľania elektriny na Slovensku: úloha EDC a OKTE, 15-minútové intervaly, alokačný kľúč a legislatívny rámec.",
};

const timeline = [
  {
    year: "August 2023",
    title: "Zdieľanie sa dostáva do zákona",
    text: "Novela zákona o energetike prvýkrát umožnila zdieľať elektrinu medzi výrobcom a spotrebiteľom mimo jedného odberného miesta.",
  },
  {
    year: "2024–2025",
    title: "Spúšťa sa Energetické dátové centrum",
    text: "OKTE zriaďuje EDC, ktoré zbiera 15-minútové dáta z inteligentných meračov a zabezpečuje samotné zúčtovanie zdieľania. Bez poplatkov za prevádzku skupiny.",
  },
  {
    year: "Január 2026",
    title: "Padajú geografické obmedzenia",
    text: "Nové pravidlá odstránili viazanosť na distribučnú oblasť a zjednodušili vznik skupín. Zdieľať sa dá naprieč celým Slovenskom.",
  },
];

export default function AkoToFungujePage() {
  return (
    <>
      <Section className="bg-ink-950 text-white">
        <p className="claim text-xs text-gold-400">Ako to funguje</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
          Zdieľanie je účtovná operácia nad reálnym meraním
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300 text-pretty">
          Najčastejšie nedorozumenie: nikto vám neťahá kábel od cudzej
          strechy. Elektrina tečie distribučnou sieťou presne ako doteraz.
          Mení sa len to, komu sa ktorá kilowatthodina priradí a za akú cenu.
        </p>
        <div className="mt-12 rounded-card border border-white/10 bg-white/[0.03] p-6 md:p-10">
          <EnergyFlow onDark />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Mechanika"
          title="Čo sa deje každých 15 minút"
          lead="Celý systém stojí na jednom čísle: koľko ste v danom štvrťhodinovom intervale vyrobili a koľko spotrebovali."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {[
            {
              n: "01",
              title: "Merač odčíta interval",
              text: "Inteligentný merací systém (IMS) zaznamená spotrebu aj výrobu v štvrťhodinovom rozlíšení a odošle dáta distribútorovi.",
            },
            {
              n: "02",
              title: "Distribútor pošle dáta do EDC",
              text: "Energetické dátové centrum, ktoré prevádzkuje OKTE, dáta zhromaždí za všetkých členov skupiny.",
            },
            {
              n: "03",
              title: "EDC uplatní alokačný kľúč",
              text: "Prebytok výrobcov sa rozdelí medzi spotrebiteľov v skupine podľa vopred dohodnutého pravidla — pomerne, staticky alebo prioritne.",
            },
            {
              n: "04",
              title: "Dodávateľ zníži faktúru",
              text: "Zdieľané kilowatthodiny sa odpočítajú z množstva, ktoré vám fakturuje váš dodávateľ. Za ne vám vystavíme faktúru my, za nižšiu cenu.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-card border border-ink-200 bg-white p-8"
            >
              <p className="font-display text-sm font-semibold text-gold-600">
                {step.n}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-950">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-600">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeading
          eyebrow="Alokačný kľúč"
          title="Kto dostane prebytok, keď ho chce viacero ľudí"
          lead="Keď je prebytku menej než dopytu, rozhoduje kľúč, ktorý si skupina nastaví."
        />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-2xl border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-300">
                <th className="py-4 pr-6 font-display font-semibold text-ink-950">
                  Kľúč
                </th>
                <th className="py-4 pr-6 font-display font-semibold text-ink-950">
                  Ako delí prebytok
                </th>
                <th className="py-4 font-display font-semibold text-ink-950">
                  Vhodné pre
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {[
                [
                  "Pomerný",
                  "Podľa aktuálnej spotreby členov v danom intervale. Kto viac spotrebúva, dostane viac.",
                  "Bežné skupiny domácností",
                ],
                [
                  "Statický",
                  "Podľa vopred dohodnutých percent, nezávisle od okamžitej spotreby.",
                  "Skupiny s dohodnutým podielom",
                ],
                [
                  "Prioritný",
                  "Najprv sa nasýtia vybrané odberné miesta, zvyšok sa rozdelí ostatným.",
                  "Obce a firmy s kľúčovými budovami",
                ],
              ].map(([name, how, who]) => (
                <tr key={name}>
                  <td className="py-4 pr-6 font-medium text-ink-950">{name}</td>
                  <td className="py-4 pr-6 text-ink-600">{how}</td>
                  <td className="py-4 text-ink-600">{who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Legislatíva"
          title="Odkiaľ sa zdieľanie vzalo"
        />
        <ol className="mt-12 space-y-8 border-l border-ink-200 pl-8">
          {timeline.map((item) => (
            <li key={item.year} className="relative">
              <span
                className="absolute -left-[2.3rem] top-1.5 h-3 w-3 rounded-full bg-gold-500 ring-4 ring-paper"
                aria-hidden="true"
              />
              <p className="claim text-xs text-gold-600">{item.year}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink-950">
                {item.title}
              </h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-ink-600">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-white">
        <SectionHeading eyebrow="Časté otázky" title="Otázky k mechanike" />
        <div className="mt-12 max-w-3xl">
          <Accordion items={faqItems.filter((i) => i.category === "zaklady")} />
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/overenie-miesta">Overiť odberné miesto</ButtonLink>
          <ButtonLink href="/slovnik" variant="ghost">
            Slovník pojmov
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
