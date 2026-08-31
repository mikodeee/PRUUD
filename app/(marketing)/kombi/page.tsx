import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import {
  BenefitList,
  OtherProducts,
  ProductFaq,
  ProductHero,
  Section,
  Steps,
} from "@/components/sections/ProductLayout";
import { products } from "@/lib/site";

const product = products.find((p) => p.slug === "kombi")!;

export const metadata: Metadata = {
  title: "PRUUD KOMBI — zdieľanie medzi vlastnými budovami",
  description:
    "Pre obce, školy a firmy s viacerými odbernými miestami. Výroba na jednej streche pokryje spotrebu ostatných budov.",
};

export default function KombiPage() {
  return (
    <>
      <ProductHero product={product} />

      <Section>
        <SectionHeading
          eyebrow="Pre koho to je"
          title="Jedna strecha, viac budov"
          lead="Typický prípad: fotovoltika na streche školy, ktorá cez prázdniny vyrába naprázdno, zatiaľ čo obecný úrad a športová hala platia plnú cenu."
        />
        <Steps
          steps={[
            {
              title: "Zmapujeme vaše odberné miesta",
              text: "Prejdeme všetky budovy, ich spotrebu a existujúce zdroje. Navrhneme, ktoré miesta zaradiť do skupiny.",
            },
            {
              title: "Nastavíme alokačný kľúč",
              text: "Určíme, ktoré budovy majú pri rozdeľovaní prebytku prednosť — napríklad tie s najvyššou dennou spotrebou.",
            },
            {
              title: "Zvyšok predáte do skupiny",
              text: "Čo vaše budovy neodoberú, ponúkneme ďalším členom. Prebytok tak nikdy nevyjde nazmar.",
            },
          ]}
        />
      </Section>

      <Section className="bg-white">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Prínos"
              title="Investícia do fotovoltiky sa vráti rýchlejšie"
            />
            <p className="mt-6 leading-relaxed text-ink-600">
              Návratnosť obecnej fotovoltiky obvykle brzdí to, že najviac
              vyrába vtedy, keď je budova prázdna. Zdieľanie medzi vlastnými
              odbernými miestami tento nesúlad odstráni — energia sa presunie
              tam, kde ju v danom intervale niekto naozaj potrebuje.
            </p>
            <p className="mt-4 leading-relaxed text-ink-600">
              Zriadenie skupiny v EDC je bezplatné a nevyžaduje verejné
              obstarávanie na dodávku elektriny — dodávateľov jednotlivých
              budov nemeníte.
            </p>
            <div className="mt-8">
              <ButtonLink href="/kontakt">Chcem nezáväznú konzultáciu</ButtonLink>
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-950">
              Čo pre vás platí
            </h3>
            <div className="mt-6">
              <BenefitList
                items={[
                  "Ľubovoľný počet odberných miest v jednej skupine",
                  "Miesta môžu byť v rôznych distribučných oblastiach",
                  "Vlastný alokačný kľúč podľa priorít budov",
                  "Prehľad spotreby všetkých budov na jednom mieste",
                  "Podklady pre rozpočet a vyúčtovanie",
                  "Bez zmeny dodávateľov jednotlivých budov",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <ProductFaq categories={["zaklady", "technika", "zmluva"]} />
      <OtherProducts currentSlug="kombi" />
    </>
  );
}
