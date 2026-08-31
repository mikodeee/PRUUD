import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Shield } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { requireUser } from "@/lib/auth";
import { getAllUsers } from "@/lib/db/admin";
import { formatDateSafe } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Používatelia",
  robots: { index: false, follow: false },
};

const df = (v: Date | string | null | undefined) =>
  formatDateSafe(v, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default async function AdminUsersPage() {
  const admin = await requireUser();
  if (admin.role !== "admin") notFound();

  const rows = await getAllUsers();

  return (
    <>
      <Link
        href="/portal/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-950"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Späť na správu
      </Link>

      <PageHeader
        title="Používatelia"
        lead={`Všetci registrovaní zákazníci, od najnovšieho. Spolu ${rows.length}.`}
      />

      <div className="overflow-x-auto rounded-card border border-ink-200 bg-white">
        <table className="w-full min-w-4xl text-left text-sm">
          <thead className="border-b border-ink-200 text-ink-500">
            <tr>
              <th className="px-6 py-4 font-medium">Meno</th>
              <th className="px-6 py-4 font-medium">Kontakt</th>
              <th className="px-6 py-4 font-medium">Registrovaný</th>
              <th className="px-6 py-4 text-center font-medium">Miesta</th>
              <th className="px-6 py-4 font-medium">Stav</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200">
            {rows.map((u) => (
              <tr key={u.id} className="hover:bg-ink-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/portal/admin/pouzivatelia/${u.id}`}
                    className="font-medium text-ink-950 hover:text-gold-700"
                  >
                    {u.name}
                  </Link>
                  {u.role === "admin" && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-petrol-100 px-2 py-0.5 text-xs font-medium text-petrol-900">
                      <Shield size={11} aria-hidden="true" />
                      správca
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-ink-700">
                  {u.email}
                  {u.phone && (
                    <span className="block text-xs text-ink-500">{u.phone}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-ink-600">
                  {df(u.createdAt)}
                </td>
                <td className="px-6 py-4 text-center tabular-nums text-ink-800">
                  {u.pointCount}
                </td>
                <td className="px-6 py-4">
                  {u.pendingCount > 0 ? (
                    <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-800">
                      {u.pendingCount} čaká na overenie
                    </span>
                  ) : u.pointCount > 0 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      overené
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
                      bez miesta
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/portal/admin/pouzivatelia/${u.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gold-700 hover:text-gold-800"
                  >
                    Detail
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-ink-600">
                  Zatiaľ nie sú žiadni registrovaní používatelia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
