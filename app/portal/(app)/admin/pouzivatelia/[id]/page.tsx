import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { PageHeader, StatCard } from "@/components/portal/PageHeader";
import { requireUser } from "@/lib/auth";
import { getUserDetail } from "@/lib/db/admin";
import { formatDateSafe, formatEur, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Detail používateľa",
  robots: { index: false, follow: false },
};

const dt = (v: Date | string | null | undefined) =>
  formatDateSafe(v, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
const d = (v: Date | string | null | undefined) =>
  formatDateSafe(v, { day: "numeric", month: "numeric", year: "numeric" });

const pointStatus: Record<string, { label: string; cls: string }> = {
  overene: { label: "Overené", cls: "bg-green-100 text-green-800" },
  caka: { label: "Čaká na overenie", cls: "bg-gold-100 text-gold-800" },
  zamietnute: { label: "Zamietnuté", cls: "bg-red-100 text-red-800" },
};

const invoiceStatus: Record<string, { label: string; cls: string }> = {
  uhradena: { label: "Uhradená", cls: "bg-green-100 text-green-800" },
  vystavena: { label: "Vystavená", cls: "bg-gold-100 text-gold-800" },
  po_splatnosti: { label: "Po splatnosti", cls: "bg-red-100 text-red-800" },
};

const leadKinds: Record<string, string> = {
  "eic-verification": "Overenie EIC",
  contact: "Kontaktný formulár",
  registration: "Registrácia",
};

function Panel({
  title,
  children,
  count,
}: {
  title: string;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <section className="mt-8 rounded-card border border-ink-200 bg-white p-6 md:p-8">
      <h2 className="font-display text-lg font-semibold text-ink-950">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-base font-normal text-ink-500">
            ({count})
          </span>
        )}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-4 text-ink-600">{text}</p>;
}

export default async function AdminUserDetailPage({
  params,
}: PageProps<"/portal/admin/pouzivatelia/[id]">) {
  const admin = await requireUser();
  if (admin.role !== "admin") notFound();

  const { id } = await params;
  const detail = await getUserDetail(id);
  if (!detail) notFound();

  const { user, points, invoices, documents, groups, history, measurements } =
    detail;

  const totalInvoiced = invoices.reduce(
    (sum, i) => sum + Number(i.amountTotal),
    0,
  );

  return (
    <>
      <Link
        href="/portal/admin/pouzivatelia"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-950"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Späť na zoznam
      </Link>

      <PageHeader
        title={user.name}
        lead={`Registrovaný ${dt(user.createdAt)}`}
      />

      {/* Identita a kontakt */}
      <section className="rounded-card border border-ink-200 bg-white p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold text-ink-950">
          Kontaktné a účtové údaje
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Meno", user.name],
            ["E-mail", user.email],
            ["Telefón", user.phone ?? "—"],
            ["Rola", user.role === "admin" ? "Správca" : "Klient"],
            ["E-mail overený", user.emailVerified ? "Áno" : "Nie"],
            ["Registrovaný", dt(user.createdAt)],
            ["ID používateľa", user.id],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-ink-500">{label}</dt>
              <dd className="mt-1 break-words font-medium text-ink-950">
                {value}
                {label === "Rola" && user.role === "admin" && (
                  <Shield
                    size={14}
                    className="ml-1.5 inline text-petrol-700"
                    aria-hidden="true"
                  />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Súhrn */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Odberné miesta" value={String(points.length)} accent />
        <StatCard
          label="Namerané intervaly"
          value={formatNumber(measurements.intervals)}
          hint={
            measurements.lastAt
              ? `posledný ${d(measurements.lastAt)}`
              : "žiadne dáta"
          }
        />
        <StatCard label="Faktúry" value={String(invoices.length)} />
        <StatCard
          label="Fakturované spolu"
          value={formatEur(totalInvoiced, 2)}
        />
      </div>

      {/* Odberné miesta */}
      <Panel title="Odberné miesta" count={points.length}>
        {points.length === 0 ? (
          <Empty text="Používateľ nemá žiadne odberné miesto." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-3xl text-left text-sm">
              <thead className="border-b border-ink-200 text-ink-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">EIC</th>
                  <th className="py-3 pr-4 font-medium">Označenie</th>
                  <th className="py-3 pr-4 font-medium">Typ</th>
                  <th className="py-3 pr-4 font-medium">Adresa</th>
                  <th className="py-3 pr-4 font-medium">Distribútor</th>
                  <th className="py-3 pr-4 font-medium">Výkon</th>
                  <th className="py-3 pr-4 font-medium">Stav</th>
                  <th className="py-3 font-medium">Pridané</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {points.map((p) => {
                  const st = pointStatus[p.status];
                  return (
                    <tr key={p.id}>
                      <td className="py-3 pr-4 font-mono text-ink-950">
                        {p.eic}
                      </td>
                      <td className="py-3 pr-4 text-ink-800">{p.label}</td>
                      <td className="py-3 pr-4 text-ink-700">{p.type}</td>
                      <td className="py-3 pr-4 text-ink-700">
                        {p.street ? `${p.street}, ${p.zip ?? ""} ${p.city ?? ""}` : "—"}
                      </td>
                      <td className="py-3 pr-4 text-ink-700">
                        {p.distributor ?? "—"}
                      </td>
                      <td className="py-3 pr-4 tabular-nums text-ink-700">
                        {p.installedKwp ? `${p.installedKwp} kWp` : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${st.cls}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="py-3 text-ink-600">
                        {d(p.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Skupiny zdieľania */}
      <Panel title="Skupiny zdieľania" count={groups.length}>
        {groups.length === 0 ? (
          <Empty text="Zatiaľ nie je zaradený do žiadnej skupiny." />
        ) : (
          <ul className="divide-y divide-ink-200">
            {groups.map((g, i) => (
              <li
                key={i}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-medium text-ink-950">{g.groupName}</p>
                  <p className="text-sm text-ink-600">
                    {g.pointLabel} · kľúč: {g.allocationKey}
                    {g.edcCode && ` · EDC ${g.edcCode}`}
                  </p>
                </div>
                {g.sharePercent && (
                  <span className="font-display text-lg font-semibold tabular-nums text-gold-700">
                    {g.sharePercent} %
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Faktúry */}
      <Panel title="Faktúry" count={invoices.length}>
        {invoices.length === 0 ? (
          <Empty text="Zatiaľ žiadne faktúry." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-2xl text-left text-sm">
              <thead className="border-b border-ink-200 text-ink-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Číslo</th>
                  <th className="py-3 pr-4 font-medium">Obdobie</th>
                  <th className="py-3 pr-4 text-right font-medium">Bez DPH</th>
                  <th className="py-3 pr-4 text-right font-medium">Spolu</th>
                  <th className="py-3 pr-4 font-medium">Splatnosť</th>
                  <th className="py-3 font-medium">Stav</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {invoices.map((inv) => {
                  const st = invoiceStatus[inv.status];
                  return (
                    <tr key={inv.id}>
                      <td className="py-3 pr-4 font-mono text-ink-950">
                        {inv.number}
                      </td>
                      <td className="py-3 pr-4 text-ink-700">
                        {d(inv.periodStart)} – {d(inv.periodEnd)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums text-ink-700">
                        {formatEur(Number(inv.amountNet), 2)}
                      </td>
                      <td className="py-3 pr-4 text-right font-medium tabular-nums text-ink-950">
                        {formatEur(Number(inv.amountTotal), 2)}
                      </td>
                      <td className="py-3 pr-4 text-ink-600">
                        {d(inv.dueDate)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${st.cls}`}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Dokumenty */}
      <Panel title="Dokumenty" count={documents.length}>
        {documents.length === 0 ? (
          <Empty text="Žiadne dokumenty." />
        ) : (
          <ul className="divide-y divide-ink-200">
            {documents.map((doc) => (
              <li key={doc.id} className="flex justify-between gap-4 py-3">
                <span className="text-ink-950">{doc.title}</span>
                <span className="text-sm text-ink-500">
                  {doc.category} · {d(doc.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* História dopytov */}
      <Panel title="História dopytov z webu" count={history.length}>
        {history.length === 0 ? (
          <Empty text="Žiadne dopyty spárované s týmto e-mailom." />
        ) : (
          <ul className="divide-y divide-ink-200">
            {history.map((lead) => (
              <li key={lead.id} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700">
                    {leadKinds[lead.kind] ?? lead.kind}
                  </span>
                  <span className="text-sm text-ink-500">
                    {dt(lead.createdAt)}
                  </span>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-ink-50 p-3 text-xs text-ink-700">
                  {JSON.stringify(lead.payload, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
