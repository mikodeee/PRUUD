import {
  DEFAULT_COVERAGE_RATE,
  PRODUCER_TIERS,
  SHARED_ENERGY_PRICE,
  SPECIFIC_YIELD_KWH_PER_KWP,
  TAX_FREE_THRESHOLD_EUR,
} from "@/lib/pricing";

/**
 * Oreže hodnotu do rozsahu a ošetrí neplatný vstup z formulára.
 * NaN spadne na minimum (nedá sa zmysluplne umiestniť), ±Infinity sa
 * oreže na príslušnú hranicu — Math.min/max ho zvládnu priamo.
 */
export function clampInput(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/* ------------------------------------------------------------------ */
/* Spotrebiteľ — PRUUD ODBER                                           */
/* ------------------------------------------------------------------ */

export type ConsumerInput = {
  /** Ročná spotreba v MWh. */
  annualConsumptionMwh: number;
  /** Súčasná cena za elektrinu v € / MWh (bez DPH). */
  currentPricePerMwh: number;
  /** Podiel spotreby, ktorý pripadá na slnečné hodiny (0–1). */
  daytimeShare: number;
  /** Podiel dennej spotreby reálne pokrytý zo zdieľania (0–1). */
  coverageRate?: number;
  /** Cena zdieľanej elektriny v € / MWh. */
  sharedPricePerMwh?: number;
};

export type ConsumerResult = {
  /** Objem elektriny odobratý zo zdieľania (MWh/rok). */
  sharedVolumeMwh: number;
  /** Náklady bez PRUUD (€/rok). */
  costWithout: number;
  /** Náklady s PRUUD (€/rok). */
  costWith: number;
  /** Ročná úspora (€). */
  annualSavings: number;
  /** Úspora ako podiel pôvodných nákladov (0–1). */
  savingsShare: number;
  /** Priemerná mesačná úspora (€). */
  monthlySavings: number;
};

/**
 * Úspora spotrebiteľa zo zdieľania elektriny.
 *
 * Zdieľaná elektrina nahrádza len tú časť spotreby, ktorá padne do slnečných
 * hodín a zároveň je v danom intervale krytá prebytkom v skupine. Zvyšok
 * spotreby ostáva u pôvodného dodávateľa za pôvodnú cenu — dodávateľa
 * sa nemení.
 */
export function calculateConsumerSavings(
  input: ConsumerInput,
): ConsumerResult {
  const consumption = clampInput(input.annualConsumptionMwh, 0, 100_000);
  const currentPrice = clampInput(input.currentPricePerMwh, 0, 10_000);
  const daytimeShare = clampInput(input.daytimeShare, 0, 1);
  const coverage = clampInput(
    input.coverageRate ?? DEFAULT_COVERAGE_RATE,
    0,
    1,
  );
  const sharedPrice = clampInput(
    input.sharedPricePerMwh ?? SHARED_ENERGY_PRICE,
    0,
    10_000,
  );

  const sharedVolumeMwh = consumption * daytimeShare * coverage;
  const restVolumeMwh = consumption - sharedVolumeMwh;

  const costWithout = consumption * currentPrice;
  const costWith = restVolumeMwh * currentPrice + sharedVolumeMwh * sharedPrice;

  // Ak je zdieľaná cena vyššia než súčasná, úspora je nulová, nie záporná —
  // zdieľanie by v takom prípade nemalo zmysel zapnúť.
  const annualSavings = Math.max(0, costWithout - costWith);

  return {
    sharedVolumeMwh,
    costWithout,
    costWith,
    annualSavings,
    savingsShare: costWithout > 0 ? annualSavings / costWithout : 0,
    monthlySavings: annualSavings / 12,
  };
}

/* ------------------------------------------------------------------ */
/* Výrobca — PRUUD VÝROBA                                              */
/* ------------------------------------------------------------------ */

export type ProducerInput = {
  /** Inštalovaný výkon FVE v kWp. */
  installedKwp: number;
  /** Podiel výroby spotrebovaný priamo v mieste (0–1). */
  selfConsumptionShare: number;
  /** Merný výnos v kWh na kWp za rok. */
  specificYield?: number;
};

export type ProducerResult = {
  /** Ročná výroba (MWh). */
  productionMwh: number;
  /** Prebytok ponúknutý do skupiny (MWh). */
  surplusMwh: number;
  /** Ročný výnos z prebytkov (€). */
  annualRevenue: number;
  /** Efektívna priemerná cena za MWh (€). */
  effectivePricePerMwh: number;
  /** Rozpis podľa cenových pásiem. */
  breakdown: Array<{ volumeMwh: number; pricePerMwh: number; revenue: number }>;
  /** Či výnos prekročí hranicu pre zdaňovanie. */
  exceedsTaxThreshold: boolean;
  /** Suma nad hranicou, ktorá podlieha dani (€). */
  taxableAmount: number;
};

/**
 * Výnos z predaja prebytkov, počítaný cez marginálne cenové pásma.
 * Každé pásmo sa uplatní len na svoju časť objemu.
 */
export function calculateProducerRevenue(
  input: ProducerInput,
): ProducerResult {
  const kwp = clampInput(input.installedKwp, 0, 100_000);
  const selfShare = clampInput(input.selfConsumptionShare, 0, 1);
  const yieldPerKwp = clampInput(
    input.specificYield ?? SPECIFIC_YIELD_KWH_PER_KWP,
    0,
    2_000,
  );

  const productionMwh = (kwp * yieldPerKwp) / 1000;
  const surplusMwh = productionMwh * (1 - selfShare);

  const breakdown: ProducerResult["breakdown"] = [];
  let remaining = surplusMwh;
  let lowerBound = 0;
  let annualRevenue = 0;

  for (const tier of PRODUCER_TIERS) {
    if (remaining <= 0) break;
    const tierCapacity = tier.upToMwh - lowerBound;
    const volumeInTier = Math.min(remaining, tierCapacity);
    const revenue = volumeInTier * tier.pricePerMwh;

    breakdown.push({
      volumeMwh: volumeInTier,
      pricePerMwh: tier.pricePerMwh,
      revenue,
    });

    annualRevenue += revenue;
    remaining -= volumeInTier;
    lowerBound = tier.upToMwh;
  }

  return {
    productionMwh,
    surplusMwh,
    annualRevenue,
    effectivePricePerMwh: surplusMwh > 0 ? annualRevenue / surplusMwh : 0,
    breakdown,
    exceedsTaxThreshold: annualRevenue > TAX_FREE_THRESHOLD_EUR,
    taxableAmount: Math.max(0, annualRevenue - TAX_FREE_THRESHOLD_EUR),
  };
}

/* ------------------------------------------------------------------ */
/* Kombi — viac odberných miest                                        */
/* ------------------------------------------------------------------ */

export type ComboResult = ConsumerResult &
  Pick<ProducerResult, "productionMwh" | "surplusMwh"> & {
    /** Prebytok, ktorý sa nespotreboval vo vlastných miestach (MWh). */
    unusedSurplusMwh: number;
    /** Výnos z prebytku predaného mimo vlastných miest (€). */
    externalRevenue: number;
    /** Celkový prínos: úspora na odbere + výnos z predaja (€). */
    totalBenefit: number;
  };

/**
 * Organizácia s vlastnou FVE a viacerými odbernými miestami.
 * Prebytok najprv pokrýva vlastné miesta (tam šetrí plnú cenu dodávateľa),
 * až zvyšok ide do skupiny za výkupnú cenu.
 */
export function calculateComboBenefit(
  producer: ProducerInput,
  consumer: ConsumerInput,
): ComboResult {
  const production = calculateProducerRevenue(producer);
  const consumerBase = calculateConsumerSavings(consumer);

  // Vlastné miesta vedia odobrať najviac toľko, koľko je ich denná spotreba.
  const selfSuppliedMwh = Math.min(
    production.surplusMwh,
    consumerBase.sharedVolumeMwh,
  );
  const unusedSurplusMwh = Math.max(
    0,
    production.surplusMwh - selfSuppliedMwh,
  );

  const external = calculateProducerRevenue({
    ...producer,
    // Prepočet výnosu len pre nespotrebovaný zvyšok: dosadíme ho ako
    // ekvivalentnú výrobu s nulovou vlastnou spotrebou.
    installedKwp:
      producer.specificYield || SPECIFIC_YIELD_KWH_PER_KWP
        ? (unusedSurplusMwh * 1000) /
          (producer.specificYield ?? SPECIFIC_YIELD_KWH_PER_KWP)
        : 0,
    selfConsumptionShare: 0,
  });

  return {
    ...consumerBase,
    productionMwh: production.productionMwh,
    surplusMwh: production.surplusMwh,
    unusedSurplusMwh,
    externalRevenue: external.annualRevenue,
    totalBenefit: consumerBase.annualSavings + external.annualRevenue,
  };
}
