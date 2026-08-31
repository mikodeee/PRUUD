import type { Metadata } from "next";
import { Section } from "@/components/sections/ProductLayout";
import { SectionHeading } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { IconInfiniteFlow, IconSharing } from "@/components/brand/icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "O nás",
  description:
    "Kto stojí za PRUUD, ako službu prevádzkujeme a pod akými licenciami pôsobíme.",
};

export default function ONasPage() {
  return (
    <>
      <Section className="bg-ink-950 text-white">
        <p className="claim text-xs text-gold-400">O nás</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
          Energia, ktorá spája
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
          Značka PRUUD stojí na jednoduchej myšlienke, ktorú nesie aj naše
          logo: dve písmená U — výrobca a spotrebiteľ — spojené tokom
          energie. Naša práca je tento spoj vytvoriť a udržať.
        </p>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Prečo to robíme" title="Prebytok, ktorý nikto nechce" />
            <p className="mt-6 leading-relaxed text-ink-600">
              Na slovenských strechách pribúda fotovoltiky rýchlejšie, než
              domácnosti stíhajú spotrebúvať. Cez poludnie vzniká energia,
              ktorá odchádza do siete za zlomok svojej hodnoty, a o niekoľko
              ulíc ďalej ju niekto v tej istej chvíli draho nakupuje.
            </p>
            <p className="mt-4 leading-relaxed text-ink-600">
              Technicky sa tento nesúlad dá vyriešiť odkedy funguje
              Energetické dátové centrum. Chýbal len niekto, kto to spraví
              dostatočne jednoducho na to, aby sa do toho bežnej domácnosti
              chcelo. To je naša úloha.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Ako pracujeme" title="Čo od nás môžete čakať" />
            <ul className="mt-8 space-y-6">
              {[
                {
                  icon: IconSharing,
                  title: "Hovoríme aj to nepríjemné",
                  text: "Zdieľanie sa neoplatí každému. Ak vaša spotreba padne mimo slnečných hodín, povieme vám to skôr, než podpíšete.",
                },
                {
                  icon: IconInfiniteFlow,
                  title: "Účtujeme podľa merania",
                  text: "Objem zdieľanej elektriny určuje EDC, nie náš odhad. Mesačné vyúčtovanie si viete overiť v portáli do poslednej kilowatthodiny.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-5">
                  <item.icon
                    className="mt-1 h-8 w-8 shrink-0 text-gold-500"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display font-semibold text-ink-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink-600">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeading
          eyebrow="Licencie a údaje"
          title="Pod čím pôsobíme"
          lead="Zdieľanie elektriny je regulovaná činnosť. Tu sú naše identifikačné údaje."
        />
        <dl className="mt-12 grid gap-8 rounded-card border border-ink-200 p-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Obchodné meno", siteConfig.company.legalName],
            ["IČO", siteConfig.company.ico],
            ["IČ DPH", siteConfig.company.icDph],
            ["Povolenie ÚRSO", siteConfig.company.ursoLicence],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-ink-500">{label}</dt>
              <dd className="mt-1 font-medium text-ink-950">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-ink-500">
          Údaje sú zatiaľ ukážkové a pred spustením ich nahradíme
          skutočnými.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/kontakt">Kontaktovať nás</ButtonLink>
          <ButtonLink href="/dokumenty" variant="ghost">
            Dokumenty na stiahnutie
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
