import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/sections/LegalPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov",
  description:
    "Ako PRUUD spracúva osobné údaje a merané dáta o spotrebe elektriny.",
};

export default function OchranaPage() {
  return (
    <LegalPage title="Ochrana osobných údajov" updated="1. 1. 2026">
      <LegalSection heading="Kto je prevádzkovateľom">
        <p>
          Prevádzkovateľom je {siteConfig.company.legalName}, IČO{" "}
          {siteConfig.company.ico}. Vo veciach ochrany osobných údajov nás
          kontaktujte na{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-gold-700 underline underline-offset-4"
          >
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Aké údaje spracúvame">
        <p>
          Identifikačné a kontaktné údaje (meno, e-mail, telefón, adresa),
          identifikátory odberných miest (EIC kód) a merané dáta o spotrebe
          a výrobe elektriny v 15-minútovom rozlíšení.
        </p>
      </LegalSection>

      <LegalSection heading="Na aký účel a na akom právnom základe">
        <p>
          Údaje spracúvame na účel uzatvorenia a plnenia zmluvy o zdieľaní
          elektriny, na účel zúčtovania a fakturácie a na plnenie zákonných
          povinností. Právnym základom je plnenie zmluvy a plnenie zákonnej
          povinnosti.
        </p>
        <p>
          Merané dáta o spotrebe spracúvame výhradne na účel zúčtovania
          zdieľania. Nepoužívame ich na profilovanie ani na marketingové
          účely.
        </p>
      </LegalSection>

      <LegalSection heading="Komu údaje sprístupňujeme">
        <p>
          Prevádzkovateľovi Energetického dátového centra (OKTE) v rozsahu
          nevyhnutnom na zaradenie do skupiny zdieľania a na zúčtovanie,
          a prevádzkovateľom distribučných sústav. Ostatní členovia skupiny
          nevidia vaše individuálne merané dáta, len súhrn za skupinu.
        </p>
      </LegalSection>

      <LegalSection heading="Ako dlho údaje uchovávame">
        <p>
          Po dobu trvania zmluvy a následne po dobu vyžadovanú právnymi
          predpismi, najmä na účely účtovníctva a daňovej evidencie.
        </p>
      </LegalSection>

      <LegalSection heading="Vaše práva">
        <p>
          Máte právo na prístup k údajom, na ich opravu a vymazanie, na
          obmedzenie spracúvania, na prenosnosť údajov a právo namietať proti
          spracúvaniu. Máte tiež právo podať sťažnosť Úradu na ochranu
          osobných údajov Slovenskej republiky.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
