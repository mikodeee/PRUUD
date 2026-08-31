import type { Metadata } from "next";
import { AlertTriangle, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/sections/ProductLayout";
import { Accordion } from "@/components/ui/Accordion";
import { faqItems } from "@/lib/content/faq";
import {
  MONTHLY_FEE,
  PRICING_PLACEHOLDER,
  PRICING_VALID_FROM,
  PRODUCER_TIERS,
  SHARED_ENERGY_PRICE,
  VAT_RATE,
} from "@/lib/pricing";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cenník",
  description:
    "Transparentný cenník zdieľania elektriny: cena zdieľanej elektriny, výkupné pásma pre výrobcov, žiadne mesačné paušály.",
};

function tierLabel(index: number) {
  const tier = PRODUCER_TIERS[index];
  const prev = index === 0 ? 0 : PRODUCER_TIERS[index - 1].upToMwh;
  if (!Number.isFinite(tier.upToMwh)) return `nad ${prev} MWh`;
  return index === 0
    ? `do ${tier.upToMwh} MWh`
    : `${prev}–${tier.upToMwh} MWh`;
}

export default function CennikPage() {
  return (
    <>
      <Section className="bg-ink-950 text-white">
        <p className="claim text-xs text-gold-400">Cenník</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
          Jedna cena za MWh. Žiadne paušály, žiadne skryté položky.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
          Platíte len za elektrinu, ktorú ste naozaj zdieľali. Objem určuje
          meranie z EDC, nie odhad.
        </p>
        <p className="mt-8 text-sm text-ink-400">
          Ceny sú bez DPH a platia od {PRICING_VALID_FROM}.
        </p>
      </Section>

      {PRICING_PLACEHOLDER && (
        <div className="border-b border-gold-300 bg-gold-50">
          <div className="container-pruud flex items-start gap-3 py-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-gold-700"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-gold-900">
              <strong className="font-semibold">Ukážkové ceny.</strong> Sadzby
              na tejto stránke sú zatiaľ placeholder a slúžia na náhľad
              rozloženia cenníka. Pred spustením ich treba nahradiť
              schválenými sadzbami — menia sa na jednom mieste v{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                lib/pricing.ts
              </code>
              .
            </p>
          </div>
        </div>
      )}

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spotrebiteľ */}
          <div className="rounded-card border border-ink-200 bg-white p-8 md:p-10">
            <h2 className="font-display text-xl font-semibold text-ink-950">
              Odber zdieľanej elektriny
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              PRUUD ODBER a odberná časť PRUUD KOMBI
            </p>
            <p className="mt-8 font-display text-5xl font-semibold tracking-tight text-ink-950">
              {SHARED_ENERGY_PRICE}
              <span className="ml-2 text-lg font-normal text-ink-600">
                € / MWh
              </span>
            </p>
            <p className="mt-2 text-sm text-ink-500">
              {formatNumber(SHARED_ENERGY_PRICE * (1 + VAT_RATE), 2)} € / MWh
              s DPH
            </p>
            <ul className="mt-8 space-y-3 border-t border-ink-200 pt-6">
              {[
                "Platíte len za skutočne zdieľané MWh",
                "Zvyšok spotreby ostáva u vášho dodávateľa",
                "Mesačné zúčtovanie podľa dát z EDC",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-700">
                  <Check
                    size={18}
                    className="mt-0.5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Výrobca */}
          <div className="rounded-card border border-ink-200 bg-white p-8 md:p-10">
            <h2 className="font-display text-xl font-semibold text-ink-950">
              Výkup prebytkov
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              PRUUD VÝROBA a výrobná časť PRUUD KOMBI
            </p>
            <p className="mt-8 font-display text-5xl font-semibold tracking-tight text-ink-950">
              až {PRODUCER_TIERS[0].pricePerMwh}
              <span className="ml-2 text-lg font-normal text-ink-600">
                € / MWh
              </span>
            </p>

            <table className="mt-8 w-full border-t border-ink-200 pt-6 text-left text-sm">
              <caption className="pt-6 pb-3 text-left text-sm text-ink-500">
                Pásma sa uplatňujú marginálne — každé len na svoju časť
                ročného objemu.
              </caption>
              <thead>
                <tr className="border-b border-ink-200">
                  <th className="py-2 font-medium text-ink-600">Ročný objem</th>
                  <th className="py-2 text-right font-medium text-ink-600">
                    Cena
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {PRODUCER_TIERS.map((tier, i) => (
                  <tr key={i}>
                    <td className="py-3 text-ink-800">{tierLabel(i)}</td>
                    <td className="py-3 text-right font-medium text-ink-950 tabular-nums">
                      {tier.pricePerMwh} € / MWh
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-card border border-ink-200 bg-white p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-3xl font-semibold text-ink-950">
                {MONTHLY_FEE} €
              </p>
              <p className="mt-1 text-sm text-ink-600">
                mesačný paušál za členstvo v skupine
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-ink-950">
                0 €
              </p>
              <p className="mt-1 text-sm text-ink-600">
                vstupný a registračný poplatok
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-ink-950">
                0 €
              </p>
              <p className="mt-1 text-sm text-ink-600">
                pokuta za predčasné ukončenie
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeading eyebrow="Časté otázky" title="Otázky k cenám a faktúram" />
        <div className="mt-12 max-w-3xl">
          <Accordion items={faqItems.filter((i) => i.category === "peniaze")} />
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/odber">Spočítať úsporu</ButtonLink>
          <ButtonLink href="/vyroba" variant="ghost">
            Spočítať výnos z prebytkov
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
