import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Card";
import { EnergyFlow } from "@/components/sections/EnergyFlow";
import {
  IconConsumer,
  IconInfiniteFlow,
  IconProducer,
  IconSharing,
} from "@/components/brand/icons";
import { products, siteConfig } from "@/lib/site";
import { MembersMap } from "@/components/sections/MembersMap";
import { HomeFaq } from "@/components/sections/HomeFaq";

const icons = {
  producer: IconProducer,
  consumer: IconConsumer,
  infinite: IconInfiniteFlow,
};

const benefits = [
  "Bez zmeny dodávateľa elektriny",
  "Bez viazanosti a bez mesačných poplatkov",
  "Bez investície do zariadení",
  "Registrácia online do 10 minút",
];

const stats = [
  { value: "2 047", label: "skupín zdieľania na Slovensku" },
  { value: "8 028", label: "zapojených odberných miest" },
  { value: "15 min", label: "interval zúčtovania cez EDC" },
  { value: "0 €", label: "mesačný poplatok" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60rem 40rem at 75% -10%, rgba(161,118,47,0.28), transparent 65%)",
          }}
          aria-hidden="true"
        />
        <div className="container-pruud relative py-20 md:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <p className="claim text-xs text-gold-400">
                Zdieľanie elektriny na Slovensku
              </p>
              <h1 className="mt-6 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance md:text-6xl">
                Energia, ktorá{" "}
                <span className="text-gold-400">spája</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300 text-pretty">
                Slnko svieti na jednu strechu, elektrinu potrebuje druhá.
                PRUUD tieto dve miesta spojí — prebytok jedného sa stane
                úsporou druhého. Bez zmeny dodávateľa, bez viazanosti.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-ink-200">
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-gold-400"
                      aria-hidden="true"
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href="/registracia" size="lg">
                  Začať registráciu
                </ButtonLink>
                <ButtonLink href="/overenie-miesta" variant="onDark" size="lg">
                  Overiť odberné miesto
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-card border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <EnergyFlow onDark />
            </div>
          </div>
        </div>
      </section>

      {/* Čísla */}
      <section className="border-b border-ink-200 bg-white">
        <div className="container-pruud grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-semibold tracking-tight text-ink-950 tabular-nums">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-ink-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produkty */}
      <section className="py-20 md:py-28">
        <div className="container-pruud">
          <SectionHeading
            eyebrow="Riešenia"
            title="Tri spôsoby, ako sa zapojiť"
            lead="Či máte panely na streche alebo len účet za elektrinu, v skupine pre vás existuje miesto."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {products.map((product) => {
              const Icon = icons[product.icon];
              return (
                <Link
                  key={product.slug}
                  href={`/${product.slug}`}
                  className="group flex flex-col rounded-card border border-ink-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                >
                  <Icon className="h-10 w-10 text-gold-500" aria-hidden="true" />
                  <h3 className="mt-6 font-display text-xl font-semibold text-ink-950">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-ink-500">{product.audience}</p>
                  <p className="mt-4 flex-1 leading-relaxed text-ink-600">
                    {product.lead}
                  </p>
                  <div className="mt-6 border-t border-ink-200 pt-5">
                    <p className="font-display text-2xl font-semibold text-gold-600">
                      {product.highlight}
                    </p>
                    <p className="text-sm text-ink-500">
                      {product.highlightLabel}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-950">
                    Zistiť viac
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ako to funguje */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-pruud">
          <SectionHeading
            eyebrow="Ako to funguje"
            title="Elektrina nikam necestuje. Cestujú dáta."
            lead="Zdieľanie je účtovná operácia nad reálnym meraním. Vaša elektrina tečie ako doteraz — mení sa len to, komu sa priradí a za koľko."
          />

          <div className="mt-14 rounded-card border border-ink-200 p-6 md:p-12">
            <EnergyFlow />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: IconProducer,
                title: "Výrobca pošle prebytok",
                text: "Čo strecha vyrobí a domácnosť práve nespotrebuje, ide do skupiny namiesto do siete za takmer nič.",
              },
              {
                icon: IconSharing,
                title: "EDC to zúčtuje",
                text: "Energetické dátové centrum porovná výrobu a spotrebu členov v každom 15-minútovom intervale a rozdelí ju podľa alokačného kľúča.",
              },
              {
                icon: IconConsumer,
                title: "Spotrebiteľ ušetrí",
                text: "Zdieľaná elektrina sa odpočíta z faktúry od vášho dodávateľa. Dodávateľa nemeníte.",
              },
            ].map((step) => (
              <div key={step.title}>
                <step.icon
                  className="h-9 w-9 text-gold-500"
                  aria-hidden="true"
                />
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-950">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-600">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <ButtonLink href="/ako-to-funguje" variant="ghost">
              Podrobné vysvetlenie
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="py-20 md:py-28">
        <div className="container-pruud grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Sieť"
              title="Skupiny rastú po celom Slovensku"
              lead="Zdieľať sa dá naprieč celou krajinou — prebytok z Pezinka vie pokryť spotrebu v Košiciach. Nie ste viazaní na susedov."
            />
            <div className="mt-8">
              <ButtonLink href="/pripadove-studie" variant="ghost">
                Pozrieť prípadové štúdie
              </ButtonLink>
            </div>
          </div>
          <MembersMap />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-pruud">
          <SectionHeading
            eyebrow="Časté otázky"
            title="Na čo sa pýtate najčastejšie"
          />
          <div className="mt-12 max-w-3xl">
            <HomeFaq />
          </div>
          <div className="mt-10">
            <ButtonLink href="/faq" variant="ghost">
              Všetky otázky
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-950 py-20 text-white md:py-24">
        <div className="container-pruud text-center">
          <IconInfiniteFlow
            className="mx-auto h-12 w-12 text-gold-400"
            aria-hidden="true"
          />
          <h2 className="mt-8 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Zistite za minútu, či sa vás zdieľanie týka
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-300">
            Stačí EIC kód z faktúry. Overíme, či má vaše odberné miesto
            inteligentné meranie — bez e-mailu a bez telefónu.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/overenie-miesta" size="lg">
              Overiť odberné miesto
            </ButtonLink>
            <ButtonLink href="/kontakt" variant="onDark" size="lg">
              Mám otázku
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-ink-500">
            Alebo nám zavolajte na{" "}
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="text-ink-300 underline underline-offset-4 hover:text-white"
            >
              {siteConfig.contact.phone}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
