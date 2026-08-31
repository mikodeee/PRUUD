/*
 * ⚠️ PLACEHOLDER CENNÍK — nahradiť reálnymi sadzbami PRUUD pred spustením.
 *
 * Všetky ceny sú na jednom mieste zámerne: kalkulačky, cenníková stránka
 * aj portál čítajú odtiaľto, takže zmena sadzby je zmena jedného súboru.
 * Ceny sú bez DPH v € / MWh.
 */

export const PRICING_PLACEHOLDER = true;
export const PRICING_VALID_FROM = "2026-01-01";

/** Cena, za ktorú člen skupiny odoberá zdieľanú elektrinu. */
export const SHARED_ENERGY_PRICE = 89;

/** Orientačná trhová cena komodity pre porovnanie v kalkulačke. */
export const DEFAULT_MARKET_PRICE = 137;

/**
 * Výkupné pásma pre výrobcu. Pásma sú marginálne — každé pásmo sa
 * uplatní len na tú časť objemu, ktorá doň spadá (ako daňové pásma),
 * nie na celý objem podľa najvyššieho dosiahnutého pásma.
 */
export const PRODUCER_TIERS = [
  { upToMwh: 10, pricePerMwh: 55 },
  { upToMwh: 20, pricePerMwh: 50 },
  { upToMwh: Infinity, pricePerMwh: 45 },
] as const;

/** Mesačný paušál. PRUUD ho neúčtuje. */
export const MONTHLY_FEE = 0;

export const VAT_RATE = 0.23;

/* --- Technické predpoklady pre odhady --- */

/** Merný výnos FVE na Slovensku, kWh na 1 kWp za rok (celoslovenský priemer). */
export const SPECIFIC_YIELD_KWH_PER_KWP = 1050;

/** Podiel výroby spotrebovanej priamo v mieste, bez batérie. */
export const DEFAULT_SELF_CONSUMPTION_SHARE = 0.3;

/**
 * Podiel dennej spotreby, ktorý sa reálne podarí pokryť zo zdieľaných
 * prebytkov. Nie je to 100 % — prebytky v skupine nie sú k dispozícii
 * v každom 15-minútovom intervale.
 */
export const DEFAULT_COVERAGE_RATE = 0.75;

/** Hranica príjmu, do ktorej fyzická osoba nemusí príjem zdaňovať (€/rok). */
export const TAX_FREE_THRESHOLD_EUR = 500;
