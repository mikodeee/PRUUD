"use client";

import { useMemo, useState } from "react";
import { calculateConsumerSavings } from "@/lib/calculations";
import { DEFAULT_MARKET_PRICE, SHARED_ENERGY_PRICE } from "@/lib/pricing";
import { RangeField } from "@/components/ui/RangeField";
import { ButtonLink } from "@/components/ui/Button";
import { formatEur, formatNumber } from "@/lib/utils";

export function ConsumerCalculator() {
  const [consumption, setConsumption] = useState(4);
  const [price, setPrice] = useState(DEFAULT_MARKET_PRICE);
  const [daytime, setDaytime] = useState(45);

  const result = useMemo(
    () =>
      calculateConsumerSavings({
        annualConsumptionMwh: consumption,
        currentPricePerMwh: price,
        daytimeShare: daytime / 100,
      }),
    [consumption, price, daytime],
  );

  return (
    <div className="grid gap-10 rounded-card border border-ink-200 bg-white p-6 md:p-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <RangeField
          label="Ročná spotreba"
          value={consumption}
          min={1}
          max={200}
          step={1}
          unit="MWh"
          hint="Bežná domácnosť spotrebuje 3–5 MWh, domácnosť s tepelným čerpadlom 8–12 MWh."
          onChange={setConsumption}
        />
        <RangeField
          label="Súčasná cena elektriny"
          value={price}
          min={60}
          max={300}
          step={1}
          unit="€/MWh"
          hint="Cena za silovú elektrinu bez DPH — nájdete ju na faktúre od dodávateľa."
          onChange={setPrice}
        />
        <RangeField
          label="Spotreba počas dňa"
          value={daytime}
          min={10}
          max={90}
          step={5}
          unit="%"
          hint="Koľko z vašej spotreby padne na slnečné hodiny (približne 8:00–17:00)."
          onChange={setDaytime}
        />
      </div>

      <div className="flex flex-col justify-between rounded-card bg-ink-950 p-7 text-white">
        <div>
          <p className="claim text-xs text-gold-400">Odhadovaná úspora</p>
          <p className="mt-4 font-display text-5xl font-semibold tracking-tight tabular-nums">
            {formatEur(result.annualSavings)}
          </p>
          <p className="mt-1 text-sm text-ink-400">za rok</p>

          <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Mesačne</dt>
              <dd className="tabular-nums">{formatEur(result.monthlySavings, 2)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Zdieľaná elektrina</dt>
              <dd className="tabular-nums">
                {formatNumber(result.sharedVolumeMwh, 2)} MWh
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Podiel na účte</dt>
              <dd className="tabular-nums">
                −{formatNumber(result.savingsShare * 100, 1)} %
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Cena zdieľanej kWh</dt>
              <dd className="tabular-nums">{SHARED_ENERGY_PRICE} €/MWh</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <ButtonLink href="/registracia" variant="onDark" className="w-full">
            Chcem odoberať lacnejšie
          </ButtonLink>
          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            Orientačný prepočet. Skutočná úspora závisí od objemu prebytkov
            v skupine a od toho, ako sa vaša spotreba prekrýva s výrobou.
          </p>
        </div>
      </div>
    </div>
  );
}
