"use client";

import { useId } from "react";

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  hint,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const display = format ? format(value) : String(value);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-ink-800">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-lg font-semibold text-ink-950 tabular-nums">
          {display}
          {unit && <span className="ml-1 text-sm font-normal text-ink-600">{unit}</span>}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-gold-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-600"
      />
      {hint && <p className="mt-2 text-xs leading-relaxed text-ink-500">{hint}</p>}
    </div>
  );
}
