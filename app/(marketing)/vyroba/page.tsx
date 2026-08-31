import type { Metadata } from "next";
import { ProducerCalculator } from "@/components/calculators/ProducerCalculator";
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

const product = products.find((p) => p.slug === "vyroba")!;

export const metadata: Metadata = {
  title: "PRUUD VÝROBA — speňažte prebytky z fotovoltiky",
  description:
    "Predajte prebytky zo svojej fotovoltiky členom skupiny namiesto toho, aby ste ich darovali do siete. Bez nových zariadení a bez viazanosti.",
};

export default function VyrobaPage() {
  return (
    <>
      <ProductHero product={product} />

      <Section>
        <SectionHeading
          eyebrow="Ako to prebieha"
          title="Z prebytku sa stane príjem"
          lead="Nemeníte nič na inštalácii ani na zmluve s dodávateľom."
        />
        <Steps
          steps={[
            {
              title: "Zaregistrujete odovzdávacie miesto",
              text: "Potrebujeme EIC kód odovzdávacieho miesta a inštalovaný výkon vašej fotovoltiky.",
            },
            {
              title: "Prebytok ide do skupiny",
              text: "Čo v danom 15-minútovom intervale nespotrebujete, ponúkneme členom skupiny za dohodnutú cenu.",
            },
            {
              title: "Mesačne dostanete zaplatené",
              text: "Zúčtovanie prebieha podľa nameraných dát z EDC. Žiadne odhady, žiadne paušály.",
            },
          ]}
        />
      </Section>

      <Section className="bg-white">
        <SectionHeading
          eyebrow="Kalkulačka"
          title="Koľko by vám prebytky zarobili"
          lead="Prepočet ráta s merným výnosom 1 050 kWh na kWp za rok, čo zodpovedá slovenskému priemeru."
        />
        <div className="mt-12">
          <ProducerCalculator />
        </div>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Porovnanie"
              title="Zdieľanie verzus virtuálna batéria"
            />
            <p className="mt-6 leading-relaxed text-ink-600">
              Virtuálna batéria vám prebytok uloží, aby ste si ho v zime
              odobrali späť — zaplatíte však distribučné poplatky a poplatok
              za službu. Zdieľanie prebytok premení na peniaze hneď.
            </p>
            <p className="mt-4 leading-relaxed text-ink-600">
              Obe možnosti sa dajú kombinovať: prebytok najprv ponúkneme
              skupine a to, čo neodoberie, môže ísť do vašej virtuálnej
              batérie. Zdieľanie vám ju nezruší.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-950">
              Čo pre vás platí
            </h3>
            <div className="mt-6">
              <BenefitList
                items={[
                  "Žiadne nové zariadenia ani zásah do inštalácie",
                  "Necháte si dodávateľa aj virtuálnu batériu",
                  "Do 500 € ročne bez zdanenia a bez živnosti",
                  "Mesačné zúčtovanie podľa reálneho merania",
                  "Bez viazanosti a bez vstupného poplatku",
                  "Vyššia cena než výkup prebytkov do siete",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <ProductFaq categories={["peniaze", "zmluva", "technika"]} />
      <OtherProducts currentSlug="vyroba" />
    </>
  );
}
