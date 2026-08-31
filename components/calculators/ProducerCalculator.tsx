"use client";

import { useMemo, useState } from "react";
import { calculateProducerRevenue } from "@/lib/calculations";
import { TAX_FREE_THRESHOLD_EUR } from "@/lib/pricing";
import { RangeField } from "@/components/ui/RangeField";
import { ButtonLink } from "@/components/ui/Button";
import { formatEur, formatNumber } from "@/lib/utils";

export function ProducerCalculator() {
  const [kwp, setKwp] = useState(7);
  const [selfUse, setSelfUse] = useState(30);

  const result = useMemo(
    () =>
      calculateProducerRevenue({
        installedKwp: kwp,
        selfConsumptionShare: selfUse / 100,
      }),
    [kwp, selfUse],
  );

  return (
    <div className="grid gap-10 rounded-card border border-ink-200 bg-white p-6 md:p-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <RangeField
          label="Výkon fotovoltiky"
          value={kwp}
          min={1}
          max={100}
          step={1}
          unit="kWp"
          hint="Bežná rodinná inštalácia má 4–10 kWp, firemná strecha 30–100 kWp."
          onChange={setKwp}
        />
        <RangeField
          label="Vlastná spotreba"
          value={selfUse}
          min={0}
          max={90}
          step={5}
          unit="%"
          hint="Koľko z výroby spotrebujete priamo v mieste. Bez batérie to býva okolo 30 %."
          onChange={setSelfUse}
        />

        <div className="rounded-lg border border-ink-200 bg-ink-50 p-5">
          <p className="text-sm font-medium text-ink-800">
            Rozpis podľa cenových pásiem
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Pásma sa uplatňujú marginálne — každé len na svoju časť objemu.
          </p>
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-xs text-ink-500">
              <tr>
                <th className="pb-2 font-medium">Objem</th>
                <th className="pb-2 font-medium">Cena</th>
                <th className="pb-2 text-right font-medium">Výnos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {result.breakdown.map((tier, i) => (
                <tr key={i}>
                  <td className="py-2 tabular-nums">
                    {formatNumber(tier.volumeMwh, 2)} MWh
                  </td>
                  <td className="py-2 tabular-nums text-ink-600">
                    {tier.pricePerMwh} €/MWh
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {formatEur(tier.revenue, 2)}
                  </td>
                </tr>
              ))}
              {result.breakdown.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-ink-500">
                    Pri tomto nastavení nevzniká žiadny prebytok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-card bg-ink-950 p-7 text-white">
        <div>
          <p className="claim text-xs text-gold-400">Odhadovaný výnos</p>
          <p className="mt-4 font-display text-5xl font-semibold tracking-tight tabular-nums">
            {formatEur(result.annualRevenue)}
          </p>
          <p className="mt-1 text-sm text-ink-400">za rok</p>

          <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Ročná výroba</dt>
              <dd className="tabular-nums">
                {formatNumber(result.productionMwh, 2)} MWh
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Prebytok do skupiny</dt>
              <dd className="tabular-nums">
                {formatNumber(result.surplusMwh, 2)} MWh
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Priemerná cena</dt>
              <dd className="tabular-nums">
                {formatNumber(result.effectivePricePerMwh, 1)} €/MWh
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-lg bg-white/5 p-4 text-xs leading-relaxed text-ink-300">
            {result.exceedsTaxThreshold ? (
              <>
                Výnos presahuje hranicu {formatEur(TAX_FREE_THRESHOLD_EUR)} za
                rok. Zdaneniu podlieha len suma nad ňou, teda{" "}
                <strong className="text-white">
                  {formatEur(result.taxableAmount)}
                </strong>
                .
              </>
            ) : (
              <>
                Výnos je pod hranicou {formatEur(TAX_FREE_THRESHOLD_EUR)} za rok
                — ako fyzická osoba ho nemusíte zdaňovať ani si zakladať
                živnosť.
              </>
            )}
          </div>
        </div>

        <div className="mt-8">
          <ButtonLink href="/registracia" variant="onDark" className="w-full">
            Chcem predávať prebytky
          </ButtonLink>
          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            Orientačný prepočet pri mernom výnose 1 050 kWh/kWp za rok.
            Skutočný výnos závisí od orientácie strechy a dopytu v skupine.
          </p>
        </div>
      </div>
    </div>
  );
}
