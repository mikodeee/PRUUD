import type { Metadata } from "next";
import { PageHeader } from "@/components/portal/PageHeader";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Nastavenia",
  robots: { index: false, follow: false },
};

export default async function NastaveniaPage() {
  const user = await requireUser();

  return (
    <>
      <PageHeader title="Nastavenia" lead="Vaše kontaktné údaje a prístup do portálu." />

      <div className="max-w-2xl space-y-6">
        <section className="rounded-card border border-ink-200 bg-white p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Profil
          </h2>
          <dl className="mt-6 space-y-5">
            {[
              ["Meno", user.name],
              ["E-mail", user.email],
              ["Rola", user.role === "admin" ? "Správca" : "Klient"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 pb-4 last:border-0 last:pb-0"
              >
                <dt className="text-sm text-ink-500">{label}</dt>
                <dd className="font-medium text-ink-950">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-card border border-ink-200 bg-white p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Zabezpečenie
          </h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Zmena hesla a dvojfaktorové overenie sa pripájajú v ďalšom kroku
            spolu s e-mailovým potvrdzovaním účtu.
          </p>
        </section>
      </div>
    </>
  );
}
