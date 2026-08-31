import type { Metadata } from "next";
import { PageHeader } from "@/components/portal/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth";
import { getSharingGroupsFor } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Zdieľanie",
  robots: { index: false, follow: false },
};

const allocationLabels: Record<string, string> = {
  pomerny: "Pomerný — podľa aktuálnej spotreby členov",
  staticky: "Statický — podľa dohodnutých percent",
  prioritny: "Prioritný — vybrané miesta majú prednosť",
};

const typeLabels: Record<string, string> = {
  odber: "Odber",
  vyroba: "Výroba",
  kombinovane: "Kombinované",
};

export default async function ZdielaniePage() {
  const user = (await getCurrentUser())!;
  const groups = await getSharingGroupsFor(user.id);

  return (
    <>
      <PageHeader
        title="Skupiny zdieľania"
        lead="Skupiny, v ktorých sú zaradené vaše odberné miesta, a pravidlo, podľa ktorého sa prebytok delí."
      />

      <div className="space-y-6">
        {groups.map((group) => (
          <article
            key={group.id}
            className="rounded-card border border-ink-200 bg-white p-6 md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-950">
                  {group.name}
                </h2>
                {group.edcCode && (
                  <p className="mt-1 font-mono text-sm text-ink-500">
                    Kód v EDC: {group.edcCode}
                  </p>
                )}
              </div>
              <span className="rounded-full bg-gold-100 px-4 py-1.5 text-sm font-medium text-gold-800">
                Aktívna
              </span>
            </div>

            <div className="mt-6 rounded-xl bg-ink-50 p-5">
              <p className="text-sm text-ink-500">Alokačný kľúč</p>
              <p className="mt-1 font-medium text-ink-950">
                {allocationLabels[group.allocationKey] ?? group.allocationKey}
              </p>
            </div>

            <h3 className="mt-8 text-sm font-medium text-ink-500">
              Vaše miesta v tejto skupine
            </h3>
            <ul className="mt-3 divide-y divide-ink-200 border-t border-ink-200">
              {group.members.map((member, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-medium text-ink-950">{member.label}</p>
                    <p className="text-sm text-ink-600">
                      {typeLabels[member.type] ?? member.type}
                    </p>
                  </div>
                  {member.sharePercent && (
                    <span className="font-display text-lg font-semibold text-gold-700 tabular-nums">
                      {member.sharePercent} %
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </article>
        ))}

        {groups.length === 0 && (
          <div className="rounded-card border border-ink-200 bg-white p-10 text-center">
            <p className="text-ink-600">
              Zatiaľ nie ste zaradení do žiadnej skupiny zdieľania. Zaradíme
              vás hneď po overení odberného miesta.
            </p>
            <div className="mt-6">
              <ButtonLink href="/portal/odberne-miesta">
                Moje odberné miesta
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
