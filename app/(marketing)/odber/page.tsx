import type { Metadata } from "next";
import { ConsumerCalculator } from "@/components/calculators/ConsumerCalculator";
import { SectionHeading } from "@/components/ui/Card";
import {
  BenefitList,
  OtherProducts,
  ProductFaq,
  ProductHero,
  Section,
  Steps,
} from "@/components/sections/ProductLayout";
import { products } from "@/lib/site";
import { DEFAULT_MARKET_PRICE, SHARED_ENERGY_PRICE } from "@/lib/pricing";

const product = products.find((p) => p.slug === "odber")!;

export const metadata: Metadata = {
  title: "PRUUD ODBER — lacnejšia elektrina zo zdieľania",
  description:
    "Odoberajte solárnu elektrinu zo skupiny za nižšiu cenu, aj keď nemáte vlastné panely. Bez zmeny dodávateľa a bez investície.",
};

export default function OdberPage() {
  return (
    <>
      <ProductHero product={product} />

      <Section>
        <SectionHeading
          eyebrow="Ako to prebieha"
          title="Od registrácie po lacnejšiu kilowatthodinu"
          lead="Nič neinštalujete a nikam nevoláte. Celý proces prebehne online."
        />
        <Steps
          steps={[
            {
              title: "Zaregistrujete odberné miesto",
              text: "Zadáte EIC kód z faktúry. Overíme, či má miesto inteligentné meranie, ktoré je pre zdieľanie nutné.",
            },
            {
              title: "Zaradíme vás do skupiny",
              text: "Nájdeme skupinu s voľnými solárnymi prebytkami a prihlásime vás do nej v Energetickom dátovom centre.",
            },
            {
              title: "Cez deň odoberáte lacnejšie",
              text: `Keď v skupine vzniká prebytok, vaša spotreba sa účtuje za ${SHARED_ENERGY_PRICE} €/MWh namiesto bežných ${DEFAULT_MARKET_PRICE} €/MWh.`,
            },
          ]}
        />
      </Section>

      <Section className="bg-white">
        <SectionHeading
          eyebrow="Kalkulačka"
          title="Koľko by ste ušetrili"
          lead="Posuňte hodnoty podľa svojej situácie. Prepočet je orientačný a ráta s tým, že prebytky nie sú dostupné v každom intervale."
        />
        <div className="mt-12">
          <ConsumerCalculator />
        </div>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Prečo to funguje"
              title="Prebytok, ktorý by inak vyšiel nazmar"
            />
            <p className="mt-6 leading-relaxed text-ink-600">
              Na slovenských strechách je dnes viac fotovoltiky, než vedia
              domácnosti cez deň spotrebovať. Prebytok odchádza do siete za
              zlomok svojej hodnoty. PRUUD ho nasmeruje k niekomu, kto ho
              práve potrebuje — výrobca dostane viac, vy zaplatíte menej.
            </p>
            <p className="mt-4 leading-relaxed text-ink-600">
              Nejde o dotáciu ani o marketingový trik. Je to len lepšie
              využitie energie, ktorá už vznikla.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-950">
              Čo pre vás platí
            </h3>
            <div className="mt-6">
              <BenefitList
                items={[
                  "Necháte si svojho dodávateľa",
                  "Žiadna investícia do zariadení",
                  "Žiadny mesačný paušál",
                  "Bez viazanosti, výpoveď do mesiaca",
                  "Dodávka nikdy nevypadne",
                  "Registrácia do 10 minút online",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <ProductFaq categories={["zaklady", "peniaze", "technika"]} />
      <OtherProducts currentSlug="odber" />
    </>
  );
}
