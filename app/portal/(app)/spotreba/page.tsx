import type { Metadata } from "next";
import { PageHeader, StatCard } from "@/components/portal/PageHeader";
import { DailyChart } from "@/components/portal/ConsumptionChart";
import { getCurrentUser } from "@/lib/auth";
import { getDailySeries, getSummary } from "@/lib/db/queries";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Spotreba",
  robots: { index: false, follow: false },
};

const RANGES = [
  { days: 30, label: "30 dní" },
  { days: 90, label: "90 dní" },
  { days: 180, label: "180 dní" },
] as const;

export default async function SpotrebaPage({
  searchParams,
}: PageProps<"/portal/spotreba">) {
  const user = (await getCurrentUser())!;
  const params = await searchParams;

  const requested = Number(params.dni);
  const days = RANGES.some((r) => r.days === requested) ? requested : 30;

  const [daily, summary] = await Promise.all([
    getDailySeries(user.id, days),
    getSummary(user.id, days),
  ]);

  return (
    <>
      <PageHeader
        title="Spotreba a zdieľanie"
        lead="Denné súhrny vypočítané z 15-minútových nameraných dát."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {RANGES.map((range) => (
          <a
            key={range.days}
            href={`/portal/spotreba?dni=${range.days}`}
            aria-current={days === range.days ? "page" : undefined}
            className={
              days === range.days
                ? "rounded-full bg-ink-950 px-4 py-2 text-sm font-medium text-white"
                : "rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-600 ring-1 ring-ink-300 ring-inset hover:bg-ink-50"
            }
          >
            {range.label}
          </a>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Spotreba"
          value={formatNumber(summary.consumptionKwh, 1)}
          unit="kWh"
        />
        <StatCard
          label="Zo zdieľania"
          value={formatNumber(summary.sharedKwh, 1)}
          unit="kWh"
        />
        <StatCard
          label="Pokrytie zdieľaním"
          value={formatNumber(summary.coverage * 100, 1)}
          unit="%"
        />
      </div>

      <section className="mt-8 rounded-card border border-ink-200 bg-white p-6 md:p-8">
        <h2 className="mb-6 font-display text-lg font-semibold text-ink-950">
          Priebeh za posledných {days} dní
        </h2>
        <DailyChart data={daily} />
      </section>

      <section className="mt-8 rounded-card border border-ink-200 bg-white p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold text-ink-950">
          Denný rozpis
        </h2>
        <div className="mt-6 max-h-125 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-ink-200 text-ink-500">
                <th className="py-2 font-medium">Dátum</th>
                <th className="py-2 text-right font-medium">Spotreba</th>
                <th className="py-2 text-right font-medium">Výroba</th>
                <th className="py-2 text-right font-medium">Zo zdieľania</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {[...daily].reverse().map((row) => (
                <tr key={row.day}>
                  <td className="py-2.5 text-ink-800">{row.day}</td>
                  <td className="py-2.5 text-right tabular-nums text-ink-800">
                    {formatNumber(row.consumption, 1)} kWh
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-ink-600">
                    {formatNumber(row.production, 1)} kWh
                  </td>
                  <td className="py-2.5 text-right font-medium tabular-nums text-gold-700">
                    {formatNumber(row.shared, 1)} kWh
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
