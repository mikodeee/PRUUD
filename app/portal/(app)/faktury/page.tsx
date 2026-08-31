import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { getCurrentUser } from "@/lib/auth";
import { getInvoices } from "@/lib/db/queries";
import { formatEur } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Faktúry",
  robots: { index: false, follow: false },
};

const statusMeta = {
  uhradena: { label: "Uhradená", className: "bg-green-100 text-green-800" },
  vystavena: { label: "Vystavená", className: "bg-gold-100 text-gold-800" },
  po_splatnosti: { label: "Po splatnosti", className: "bg-red-100 text-red-800" },
} as const;

const df = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function FakturyPage() {
  const user = (await getCurrentUser())!;
  const rows = await getInvoices(user.id);

  return (
    <>
      <PageHeader
        title="Faktúry"
        lead="Vyúčtovanie zdieľanej elektriny. Objem vychádza z nameraných dát z EDC."
      />

      <div className="overflow-x-auto rounded-card border border-ink-200 bg-white">
        <table className="w-full min-w-3xl text-left text-sm">
          <thead className="border-b border-ink-200 text-ink-500">
            <tr>
              <th className="px-6 py-4 font-medium">Číslo</th>
              <th className="px-6 py-4 font-medium">Obdobie</th>
              <th className="px-6 py-4 font-medium">Splatnosť</th>
              <th className="px-6 py-4 text-right font-medium">Bez DPH</th>
              <th className="px-6 py-4 text-right font-medium">Spolu</th>
              <th className="px-6 py-4 font-medium">Stav</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200">
            {rows.map((invoice) => {
              const status = statusMeta[invoice.status];
              return (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 font-mono text-ink-950">
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 text-ink-700">
                    {df.format(invoice.periodStart)} –{" "}
                    {df.format(invoice.periodEnd)}
                  </td>
                  <td className="px-6 py-4 text-ink-700">
                    {df.format(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-ink-700">
                    {formatEur(Number(invoice.amountNet), 2)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium tabular-nums text-ink-950">
                    {formatEur(Number(invoice.amountTotal), 2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className="inline-flex cursor-not-allowed items-center gap-1.5 text-sm text-ink-400"
                      title="PDF faktúry sa generujú po napojení na fakturačný systém"
                    >
                      <Download size={15} aria-hidden="true" />
                      PDF
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-ink-600">
                  Zatiaľ nemáte žiadne faktúry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink-500">
        Generovanie PDF faktúr sa pripája až spolu s fakturačným systémom
        v poslednej fáze projektu. Sumy v tabuľke pochádzajú z demo dát.
      </p>
    </>
  );
}
