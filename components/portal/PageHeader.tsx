import type { ReactNode } from "react";

export function PageHeader({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-950 md:text-3xl">
          {title}
        </h1>
        {lead && <p className="mt-2 max-w-2xl text-ink-600">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit,
  hint,
  accent = false,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-card bg-ink-950 p-6 text-white"
          : "rounded-card border border-ink-200 bg-white p-6"
      }
    >
      <p className={accent ? "text-sm text-ink-400" : "text-sm text-ink-500"}>
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight tabular-nums">
        {value}
        {unit && (
          <span
            className={
              accent
                ? "ml-1.5 text-base font-normal text-ink-400"
                : "ml-1.5 text-base font-normal text-ink-500"
            }
          >
            {unit}
          </span>
        )}
      </p>
      {hint && (
        <p className={accent ? "mt-2 text-sm text-ink-400" : "mt-2 text-sm text-ink-500"}>
          {hint}
        </p>
      )}
    </div>
  );
}
