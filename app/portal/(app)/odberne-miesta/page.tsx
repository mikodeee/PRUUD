import type { Metadata } from "next";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth";
import { getMeteringPoints } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Odberné miesta",
  robots: { index: false, follow: false },
};

const statusMeta = {
  overene: { label: "Overené", icon: CheckCircle2, className: "text-green-700" },
  caka: { label: "Čaká na overenie", icon: Clock, className: "text-gold-700" },
  zamietnute: { label: "Zamietnuté", icon: XCircle, className: "text-red-700" },
} as const;

const typeLabels = {
  odber: "Odberné miesto",
  vyroba: "Odovzdávacie miesto",
  kombinovane: "Kombinované",
} as const;

export default async function OdberneMiestaPage() {
  const user = (await getCurrentUser())!;
  const points = await getMeteringPoints(user.id);

  return (
    <>
      <PageHeader
        title="Odberné miesta"
        lead="Miesta zapojené do zdieľania. Nové pridáte cez EIC kód z faktúry."
        action={<ButtonLink href="/portal/odberne-miesta">Pridať miesto</ButtonLink>}
      />

      <div className="space-y-4">
        {points.map((point) => {
          const status = statusMeta[point.status];
          const StatusIcon = status.icon;

          return (
            <article
              key={point.id}
              className="rounded-card border border-ink-200 bg-white p-6 md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink-950">
                    {point.label}
                  </h2>
                  <p className="mt-1 text-sm text-ink-600">
                    {typeLabels[point.type]}
                    {point.distributor && ` · ${point.distributor}`}
                  </p>
                  {point.street && (
                    <p className="mt-3 text-ink-700">
                      {point.street}, {point.zip} {point.city}
                    </p>
                  )}
                </div>

                <div
                  className={`flex items-center gap-2 text-sm font-medium ${status.className}`}
                >
                  <StatusIcon size={18} aria-hidden="true" />
                  {status.label}
                </div>
              </div>

              <dl className="mt-6 grid gap-6 border-t border-ink-200 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-ink-500">EIC kód</dt>
                  <dd className="mt-1 font-mono text-sm text-ink-950">
                    {point.eic}
                  </dd>
                </div>
                {point.installedKwp && (
                  <div>
                    <dt className="text-sm text-ink-500">Inštalovaný výkon</dt>
                    <dd className="mt-1 font-medium text-ink-950">
                      {point.installedKwp} kWp
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-ink-500">Pridané</dt>
                  <dd className="mt-1 text-ink-950">
                    {new Intl.DateTimeFormat("sk-SK").format(point.createdAt)}
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}

        {points.length === 0 && (
          <div className="rounded-card border border-ink-200 bg-white p-10 text-center">
            <p className="text-ink-600">
              Zatiaľ nemáte pridané žiadne odberné miesto.
            </p>
            <div className="mt-6">
              <ButtonLink href="/overenie-miesta">
                Overiť odberné miesto
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
