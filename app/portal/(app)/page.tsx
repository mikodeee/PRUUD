import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, StatCard } from "@/components/portal/PageHeader";
import { DailyChart, HourlyProfileChart } from "@/components/portal/ConsumptionChart";
import { requireUser } from "@/lib/auth";
import {
  getDailySeries,
  getHourlyProfile,
  getMeteringPoints,
  getSummary,
} from "@/lib/db/queries";
import { SHARED_ENERGY_PRICE, DEFAULT_MARKET_PRICE } from "@/lib/pricing";
import { formatEur, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Prehľad",
  robots: { index: false, follow: false },
};

export default async function PortalDashboard() {
  const user = await requireUser();

  const [summary, daily, hourly, points] = await Promise.all([
    getSummary(user.id, 30),
    getDailySeries(user.id, 30),
    getHourlyProfile(user.id, 30),
    getMeteringPoints(user.id),
  ]);

  // Úspora = objem zo zdieľania × rozdiel medzi bežnou a zdieľanou cenou.
  const savings =
    (summary.sharedKwh / 1000) * (DEFAULT_MARKET_PRICE - SHARED_ENERGY_PRICE);

  return (
    <>
      <PageHeader
        title={`Dobrý deň, ${user.name.split(" ")[0]}`}
        lead="Súhrn za posledných 30 dní naprieč všetkými vašimi odbernými miestami."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Úspora zo zdieľania"
          value={formatEur(savings, 2)}
          hint="za posledných 30 dní"
          accent
        />
        <StatCard
          label="Zo zdieľania"
          value={formatNumber(summary.sharedKwh, 1)}
          unit="kWh"
          hint={`${formatNumber(summary.coverage * 100, 1)} % vašej spotreby`}
        />
        <StatCard
          label="Celková spotreba"
          value={formatNumber(summary.consumptionKwh, 1)}
          unit="kWh"
        />
        <StatCard
          label="Vlastná výroba"
          value={formatNumber(summary.productionKwh, 1)}
          unit="kWh"
        />
      </div>

      <section className="mt-8 rounded-card border border-ink-200 bg-white p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Spotreba a zdieľanie po dňoch
          </h2>
          <Link
            href="/portal/spotreba"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold-700 hover:text-gold-800"
          >
            Detailný pohľad
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <DailyChart data={daily} />
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-card border border-ink-200 bg-white p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Priemerný denný profil
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Kedy počas dňa vaša spotreba naozaj padne do hodín, keď v skupine
            vznikajú prebytky. Rozdiel medzi stĺpcami je priestor na úsporu.
          </p>
          <div className="mt-6">
            <HourlyProfileChart data={hourly} />
          </div>
        </section>

        <section className="rounded-card border border-ink-200 bg-white p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Vaše odberné miesta
          </h2>
          <ul className="mt-6 divide-y divide-ink-200">
            {points.map((point) => (
              <li key={point.id} className="py-4 first:pt-0">
                <p className="font-medium text-ink-950">{point.label}</p>
                <p className="mt-0.5 text-sm text-ink-600">
                  {point.city ?? "Adresa neuvedená"}
                </p>
                <p className="mt-1 font-mono text-xs text-ink-500">{point.eic}</p>
              </li>
            ))}
            {points.length === 0 && (
              <li className="py-4 text-ink-600">
                Zatiaľ nemáte žiadne odberné miesto.
              </li>
            )}
          </ul>
          <Link
            href="/portal/odberne-miesta"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-700 hover:text-gold-800"
          >
            Spravovať miesta
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
