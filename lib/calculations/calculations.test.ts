import { describe, expect, it } from "vitest";
import {
  calculateComboBenefit,
  calculateConsumerSavings,
  calculateProducerRevenue,
  clampInput,
} from "./index";
import { calculateEicCheckChar, validateEic } from "./eic";

describe("clampInput", () => {
  it("odfiltruje NaN a Infinity na spodnú hranicu", () => {
    expect(clampInput(NaN, 0, 100)).toBe(0);
    expect(clampInput(Infinity, 0, 100)).toBe(100);
    expect(clampInput(-Infinity, 0, 100)).toBe(0);
  });
});

describe("calculateConsumerSavings", () => {
  it("pri nulovej spotrebe nevráti žiadnu úsporu", () => {
    const r = calculateConsumerSavings({
      annualConsumptionMwh: 0,
      currentPricePerMwh: 137,
      daytimeShare: 0.6,
    });
    expect(r.annualSavings).toBe(0);
    expect(r.savingsShare).toBe(0);
  });

  it("počíta úsporu len z pokrytej dennej spotreby", () => {
    // 10 MWh × 60 % denná × 75 % pokrytie = 4,5 MWh zdieľaných
    // úspora = 4,5 × (137 − 89) = 216 €
    const r = calculateConsumerSavings({
      annualConsumptionMwh: 10,
      currentPricePerMwh: 137,
      daytimeShare: 0.6,
      coverageRate: 0.75,
      sharedPricePerMwh: 89,
    });
    expect(r.sharedVolumeMwh).toBeCloseTo(4.5, 6);
    expect(r.annualSavings).toBeCloseTo(216, 6);
    expect(r.monthlySavings).toBeCloseTo(18, 6);
  });

  it("nevráti zápornú úsporu, keď je zdieľaná cena vyššia", () => {
    const r = calculateConsumerSavings({
      annualConsumptionMwh: 10,
      currentPricePerMwh: 60,
      daytimeShare: 1,
      sharedPricePerMwh: 89,
    });
    expect(r.annualSavings).toBe(0);
  });

  it("nikdy nevráti NaN ani Infinity pri extrémnych vstupoch", () => {
    const r = calculateConsumerSavings({
      annualConsumptionMwh: Infinity,
      currentPricePerMwh: NaN,
      daytimeShare: 5,
    });
    expect(Number.isFinite(r.annualSavings)).toBe(true);
    expect(Number.isFinite(r.savingsShare)).toBe(true);
  });
});

describe("calculateProducerRevenue", () => {
  it("uplatní cenové pásma marginálne, nie plošne", () => {
    // 30 kWp × 1050 kWh = 31,5 MWh výroba, 0 % vlastná spotreba
    // → 10 MWh × 55 + 10 MWh × 50 + 11,5 MWh × 45 = 550 + 500 + 517,5 = 1567,5 €
    const r = calculateProducerRevenue({
      installedKwp: 30,
      selfConsumptionShare: 0,
    });
    expect(r.productionMwh).toBeCloseTo(31.5, 6);
    expect(r.surplusMwh).toBeCloseTo(31.5, 6);
    expect(r.annualRevenue).toBeCloseTo(1567.5, 6);
    expect(r.breakdown).toHaveLength(3);
  });

  it("malý zdroj ostane celý v prvom pásme", () => {
    // 5 kWp × 1050 = 5,25 MWh, 30 % vlastná spotreba → 3,675 MWh × 55 = 202,125 €
    const r = calculateProducerRevenue({
      installedKwp: 5,
      selfConsumptionShare: 0.3,
    });
    expect(r.breakdown).toHaveLength(1);
    expect(r.annualRevenue).toBeCloseTo(202.125, 6);
    expect(r.effectivePricePerMwh).toBeCloseTo(55, 6);
  });

  it("rozpozná prekročenie hranice pre zdanenie", () => {
    const small = calculateProducerRevenue({
      installedKwp: 5,
      selfConsumptionShare: 0.3,
    });
    expect(small.exceedsTaxThreshold).toBe(false);
    expect(small.taxableAmount).toBe(0);

    const big = calculateProducerRevenue({
      installedKwp: 30,
      selfConsumptionShare: 0,
    });
    expect(big.exceedsTaxThreshold).toBe(true);
    expect(big.taxableAmount).toBeCloseTo(1067.5, 6);
  });

  it("pri nulovom výkone nevráti NaN", () => {
    const r = calculateProducerRevenue({
      installedKwp: 0,
      selfConsumptionShare: 0.3,
    });
    expect(r.annualRevenue).toBe(0);
    expect(r.effectivePricePerMwh).toBe(0);
  });
});

describe("calculateComboBenefit", () => {
  it("prebytok najprv pokryje vlastné miesta, zvyšok ide do skupiny", () => {
    const r = calculateComboBenefit(
      { installedKwp: 50, selfConsumptionShare: 0 },
      {
        annualConsumptionMwh: 20,
        currentPricePerMwh: 137,
        daytimeShare: 0.6,
        coverageRate: 0.75,
      },
    );
    // výroba 52,5 MWh; vlastné miesta odoberú 20 × 0,6 × 0,75 = 9 MWh
    expect(r.surplusMwh).toBeCloseTo(52.5, 6);
    expect(r.unusedSurplusMwh).toBeCloseTo(43.5, 6);
    expect(r.totalBenefit).toBeGreaterThan(r.annualSavings);
  });
});

describe("EIC kontrolný znak", () => {
  it("sedí s dokumentovaným príkladom ENTSO-E 11Y123456789012T", () => {
    expect(calculateEicCheckChar("11Y123456789012")).toBe("T");
  });

  it("odmietne neplatný znak vo vstupe", () => {
    expect(calculateEicCheckChar("11Y12345678901*")).toBeNull();
  });

  it("odmietne vstup inej dĺžky", () => {
    expect(calculateEicCheckChar("11Y1234")).toBeNull();
  });
});

describe("validateEic", () => {
  /** Zostaví slovenský EIC aj s korektným kontrolným znakom. */
  function makeSkEic(body12: string) {
    const first15 = `24Z${body12}`;
    return first15 + calculateEicCheckChar(first15);
  }

  it("prijme platné slovenské odberné miesto", () => {
    const r = validateEic(makeSkEic("SKA000000001"));
    expect(r.valid).toBe(true);
    if (r.valid) {
      expect(r.isSlovak).toBe(true);
      expect(r.checksumOk).toBe(true);
    }
  });

  it("normalizuje malé písmená a medzery", () => {
    const eic = makeSkEic("SKA000000001");
    const r = validateEic(`  ${eic.toLowerCase()}  `);
    expect(r.valid).toBe(true);
    if (r.valid) expect(r.normalized).toBe(eic);
  });

  it("odmietne zlú dĺžku", () => {
    expect(validateEic("24ZSK123")).toEqual({ valid: false, reason: "length" });
  });

  it("odmietne nepovolené znaky", () => {
    expect(validateEic("24ZSK*12345678A")).toEqual({
      valid: false,
      reason: "length",
    });
    expect(validateEic("24ZSK*123456789A")).toEqual({
      valid: false,
      reason: "charset",
    });
  });

  it("prijme kód so správnym prefixom aj keď kontrolný znak nesedí", () => {
    const eic = makeSkEic("SKA000000001");
    const wrong = eic.slice(0, 15) + (eic[15] === "0" ? "1" : "0");
    const r = validateEic(wrong);
    // Kľúčové: kód nesmie byť odmietnutý — reálne slovenské kódy
    // nemusia tomuto výpočtu vyhovieť.
    expect(r.valid).toBe(true);
    if (r.valid) expect(r.checksumOk).toBe(false);
  });

  it("prijme slovenský kód s iným tretím znakom než Z", () => {
    const r = validateEic("24XSK1234567890");
    expect(r).toEqual({ valid: false, reason: "length" });
    expect(validateEic("24XSK12345678901").valid).toBe(true);
  });

  it("odmietne zahraničný kód, keď žiadame slovenské miesto", () => {
    expect(validateEic("11Y123456789012T")).toEqual({
      valid: false,
      reason: "not-slovak",
    });
  });

  it("prijme zahraničný kód, keď kontrolu krajiny vypneme", () => {
    const r = validateEic("11Y123456789012T", false);
    expect(r.valid).toBe(true);
    if (r.valid) expect(r.checksumOk).toBe(true);
  });

  it("odmietne prázdny vstup", () => {
    expect(validateEic("")).toEqual({ valid: false, reason: "empty" });
  });
});
