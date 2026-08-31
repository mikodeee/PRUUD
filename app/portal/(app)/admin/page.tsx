import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader, StatCard } from "@/components/portal/PageHeader";
import { requireUser } from "@/lib/auth";
import { getAdminStats, getPendingPoints, getRecentLeads } from "@/lib/db/admin";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Správa",
  robots: { index: false, follow: false },
};

const leadKindLabels: Record<string, string> = {
  "eic-verification": "Overenie EIC",
  contact: "Kontaktný formulár",
  registration: "Registrácia",
};

const df = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminPage() {
  const user = await requireUser();
  // Rola sa kontroluje na serveri — skrytie odkazu v navigácii nestačí.
  if (user.role !== "admin") notFound();

  const [stats, pending, recentLeads] = await Promise.all([
    getAdminStats(),
    getPendingPoints(),
    getRecentLeads(),
  ]);

  return (
    <>
      <PageHeader
        title="Správa"
        lead="Prehľad platformy, čakajúce overenia a dopyty z webu."
      />

      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/portal/admin/pouzivatelia"
          className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
        >
          Všetci používatelia
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Používatelia" value={formatNumber(stats.users)} accent />
        <StatCard label="Odberné miesta" value={formatNumber(stats.meteringPoints)} />
        <StatCard label="Skupiny zdieľania" value={formatNumber(stats.groups)} />
        <StatCard
          label="Namerané intervaly"
          value={formatNumber(stats.intervals)}
          hint="15-minútových záznamov"
        />
      </div>

      <section className="mt-8 rounded-card border border-ink-200 bg-white p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold text-ink-950">
          Čaká na overenie
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-2xl text-left text-sm">
            <thead className="border-b border-ink-200 text-ink-500">
              <tr>
                <th className="py-3 font-medium">EIC</th>
                <th className="py-3 font-medium">Zákazník</th>
                <th className="py-3 font-medium">Typ</th>
                <th className="py-3 font-medium">Pridané</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {pending.map((point) => (
                <tr key={point.id}>
                  <td className="py-3 font-mono text-ink-950">{point.eic}</td>
                  <td className="py-3 text-ink-700">
                    {point.userName ?? "—"}
                    <span className="block text-xs text-ink-500">
                      {point.userEmail ?? ""}
                    </span>
                  </td>
                  <td className="py-3 text-ink-700">{point.type}</td>
                  <td className="py-3 text-ink-600">
                    {df.format(point.createdAt)}
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-ink-600">
                    Žiadne miesta nečakajú na overenie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-card border border-ink-200 bg-white p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold text-ink-950">
          Posledné dopyty z webu
        </h2>
        <ul className="mt-6 divide-y divide-ink-200">
          {recentLeads.map((lead) => (
            <li key={lead.id} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700">
                  {leadKindLabels[lead.kind] ?? lead.kind}
                </span>
                <span className="text-sm text-ink-500">
                  {df.format(lead.createdAt)}
                </span>
              </div>
              {lead.email && (
                <p className="mt-2 text-sm text-ink-950">{lead.email}</p>
              )}
              <pre className="mt-2 overflow-x-auto rounded-lg bg-ink-50 p-3 text-xs text-ink-700">
                {JSON.stringify(lead.payload, null, 2)}
              </pre>
            </li>
          ))}
          {recentLeads.length === 0 && (
            <li className="py-8 text-center text-ink-600">
              Zatiaľ žiadne dopyty.
            </li>
          )}
        </ul>
      </section>
    </>
  );
}
