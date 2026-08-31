import "server-only";
import { createHash } from "node:crypto";
import { validateEic } from "@/lib/calculations/eic";

/*
 * Zistenie stavu odberného miesta — najmä toho, či má priebehové
 * (inteligentné) meranie IMS, ktoré je podmienkou zdieľania.
 *
 * DÔLEŽITÉ: či konkrétne odberné miesto má IMS, sa NEDÁ zistiť z verejných
 * zdrojov. Verejné API OKTE (isot.okte.sk) poskytuje len trhové dáta —
 * zúčtovanie odchýlok, denný a vnútrodenný trh, plány výroby. Údaj
 * o konkrétnom odbernom mieste je osobný údaj a je dostupný až na základe
 * Zmluvy o poskytovaní údajov s OKTE a prístupu do EDC.
 *
 * Preto tento modul štandardne vracia "nezname" a overenie sa dorieši
 * manuálne cez správcovskú frontu. Vymyslenú odpoveď reálnemu zákazníkovi
 * nikdy neukážeme.
 *
 * Zapojenie reálneho zdroja = nastaviť EDC_API_URL a doplniť telo
 * `queryEdc()`. Nič iné sa meniť nemusí.
 */

export type MeteringStatus = "ims" | "bez-ims" | "nezname";

export type MeteringLookup = {
  eic: string;
  status: MeteringStatus;
  /** Distribučná oblasť odvodená z EIC kódu, ak sa dá určiť. */
  distributor: Distributor | null;
  /** Odkiaľ výsledok pochádza — rozhoduje o tom, čo smieme tvrdiť. */
  source: "edc" | "demo" | "neoverene";
};

export type Distributor = {
  code: "ZSD" | "SSD" | "VSD";
  name: string;
  /** Portál, kde si zákazník vie typ elektromera overiť sám. */
  portalUrl: string;
};

const DISTRIBUTORS: Array<{ pattern: RegExp; info: Distributor }> = [
  {
    pattern: /^24[A-Z]ZS/,
    info: {
      code: "ZSD",
      name: "Západoslovenská distribučná",
      portalUrl: "https://www.zsdis.sk",
    },
  },
  {
    pattern: /^24[A-Z]SS/,
    info: {
      code: "SSD",
      name: "Stredoslovenská distribučná",
      portalUrl: "https://www.ssd.sk",
    },
  },
  {
    pattern: /^24[A-Z]VS/,
    info: {
      code: "VSD",
      name: "Východoslovenská distribučná",
      portalUrl: "https://www.vsds.sk",
    },
  },
];

/**
 * Distribučnú oblasť sa dá z EIC kódu odvodiť spoľahlivo — je zakódovaná
 * v znakoch 4–5 (napr. 24ZZS… = Západoslovenská distribučná).
 */
export function detectDistributor(eic: string): Distributor | null {
  return DISTRIBUTORS.find((d) => d.pattern.test(eic))?.info ?? null;
}

/** Deterministický ukážkový výsledok — len pre demo, nikdy nie v produkcii. */
function demoStatus(eic: string): MeteringStatus {
  return createHash("sha256").update(eic).digest()[0] % 5 === 0
    ? "bez-ims"
    : "ims";
}

/**
 * Sem príde volanie EDC, keď bude podpísaná Zmluva o poskytovaní údajov
 * s OKTE. Rozhranie okolo sa nemení.
 */
async function queryEdc(eic: string): Promise<MeteringStatus | null> {
  const baseUrl = process.env.EDC_API_URL;
  const token = process.env.EDC_API_TOKEN;
  if (!baseUrl || !token) return null;

  // TODO(fáza 3): dotaz na EDC podľa TŠVD. Očakávaná odpoveď obsahuje
  // typ merania odberného miesta (priebehové / iné).
  // Prístupový token sa číta z prostredia — do kódu ani do repozitára
  // sa žiadne prihlasovacie údaje nikdy nezapisujú.
  void eic;
  return null;
}

export async function lookupMeteringPoint(
  input: string,
): Promise<MeteringLookup | null> {
  const validation = validateEic(input);
  if (!validation.valid) return null;

  const eic = validation.normalized;
  const distributor = detectDistributor(eic);

  const fromEdc = await queryEdc(eic);
  if (fromEdc) {
    return { eic, status: fromEdc, distributor, source: "edc" };
  }

  // Ukážkový režim sa zapína výslovne a slúži na predvedenie toku.
  if (process.env.PRUUD_DEMO_METERING === "1") {
    return { eic, status: demoStatus(eic), distributor, source: "demo" };
  }

  return { eic, status: "nezname", distributor, source: "neoverene" };
}
