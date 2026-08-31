import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/sections/LegalPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Obchodné podmienky",
  description: "Všeobecné obchodné podmienky služby zdieľania elektriny PRUUD.",
};

export default function ObchodnePodmienkyPage() {
  return (
    <LegalPage title="Všeobecné obchodné podmienky" updated="1. 1. 2026">
      <LegalSection heading="1. Kto službu poskytuje">
        <p>
          Službu zdieľania elektriny poskytuje {siteConfig.company.legalName},
          so sídlom {siteConfig.company.street}, {siteConfig.company.zip}{" "}
          {siteConfig.company.city}, IČO {siteConfig.company.ico}, na základe
          povolenia Úradu pre reguláciu sieťových odvetví č.{" "}
          {siteConfig.company.ursoLicence}.
        </p>
      </LegalSection>

      <LegalSection heading="2. Predmet služby">
        <p>
          Predmetom služby je zaradenie odberného alebo odovzdávacieho miesta
          zákazníka do skupiny zdieľania elektriny registrovanej v Energetickom
          dátovom centre, ktoré prevádzkuje OKTE, a s tým súvisiace zúčtovanie
          zdieľanej elektriny.
        </p>
        <p>
          Poskytovateľ nie je dodávateľom elektriny. Zmluvný vzťah zákazníka
          s jeho dodávateľom elektriny ostáva touto zmluvou nedotknutý.
        </p>
      </LegalSection>

      <LegalSection heading="3. Podmienky poskytnutia služby">
        <p>
          Podmienkou je odberné miesto vybavené inteligentným meracím systémom,
          ktorý poskytuje merané dáta v 15-minútovom rozlíšení, a súhlas
          zákazníka so sprístupnením týchto dát na účel zúčtovania zdieľania.
        </p>
      </LegalSection>

      <LegalSection heading="4. Ceny a platobné podmienky">
        <p>
          Ceny sa riadia platným cenníkom zverejneným na webovom sídle
          poskytovateľa. Zúčtovanie prebieha mesačne na základe údajov
          poskytnutých Energetickým dátovým centrom.
        </p>
      </LegalSection>

      <LegalSection heading="5. Trvanie a ukončenie zmluvy">
        <p>
          Zmluva sa uzatvára na dobu neurčitú bez viazanosti. Ktorákoľvek
          zmluvná strana ju môže vypovedať s výpovednou lehotou jeden mesiac,
          ktorá začína plynúť prvým dňom kalendárneho mesiaca nasledujúceho po
          doručení výpovede. Za ukončenie zmluvy sa neúčtuje žiadny poplatok.
        </p>
      </LegalSection>

      <LegalSection heading="6. Reklamácie">
        <p>
          Postup pri uplatnení reklamácie upravuje reklamačný poriadok, ktorý
          tvorí prílohu týchto podmienok.
        </p>
      </LegalSection>

      <LegalSection heading="7. Záverečné ustanovenia">
        <p>
          Vzťahy neupravené týmito podmienkami sa riadia právnym poriadkom
          Slovenskej republiky, najmä zákonom o energetike a Občianskym
          zákonníkom.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
