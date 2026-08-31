import type { Metadata } from "next";
import { Section } from "@/components/sections/ProductLayout";
import { SectionHeading } from "@/components/ui/Card";
import { EicVerification } from "@/components/forms/EicVerification";
import { Accordion } from "@/components/ui/Accordion";
import { faqItems } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "Overenie odberného miesta",
  description:
    "Zistite, či je vaše odberné miesto pripravené na zdieľanie elektriny. Stačí EIC kód z faktúry — bez e-mailu a bez telefónu.",
};

export default function OverenieMiestaPage() {
  return (
    <>
      <Section className="bg-ink-950 text-white">
        <p className="claim text-xs text-gold-400">Overenie</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
          Je vaše odberné miesto pripravené na zdieľanie?
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
          Zdieľanie vyžaduje inteligentný merací systém (IMS), ktorý meria
          spotrebu v 15-minútových intervaloch. Overíme to za vás — stačí
          EIC kód z faktúry.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <EicVerification />

          <div>
            <h2 className="font-display text-xl font-semibold text-ink-950">
              Kde nájdem EIC kód?
            </h2>
            <ol className="mt-6 space-y-5">
              {[
                "Vezmite si poslednú faktúru alebo vyúčtovanie od dodávateľa elektriny.",
                "Nájdite časť s údajmi o odbernom mieste — býva hneď pod adresou.",
                "EIC kód má 16 znakov a slovenské odberné miesta sa začínajú číslicami 24.",
                "Prepíšte ho aj s poslednou číslicou alebo písmenom — je to kontrolný znak.",
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-semibold text-gold-700">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-ink-600">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-card border border-ink-200 bg-white p-6">
              <h3 className="font-display font-semibold text-ink-950">
                Čo overenie robí
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Okamžite skontrolujeme štruktúru kódu a jeho kontrolný znak
                podľa štandardu ENTSO-E. Dostupnosť inteligentného merania
                následne overíme v registri a ozveme sa vám — na to potrebujeme
                jeden pracovný deň.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeading eyebrow="Časté otázky" title="Otázky k technickým podmienkam" />
        <div className="mt-12 max-w-3xl">
          <Accordion items={faqItems.filter((i) => i.category === "technika")} />
        </div>
      </Section>
    </>
  );
}
