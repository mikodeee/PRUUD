"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyPoint, HourlyPoint } from "@/lib/db/queries";

/*
 * Grafy dostávajú už agregovaný rad zo servera — denné súčty alebo
 * priemerný hodinový profil. Surové 15-minútové dáta sa do prehliadača
 * neposielajú nikdy.
 */

const COLORS = {
  consumption: "#9096a5",
  shared: "#a1762f",
  production: "#2b6d80",
};

function formatDay(day: string) {
  const [, month, date] = day.split("-");
  return `${Number(date)}.${Number(month)}.`;
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #d7dae1",
  fontSize: 13,
};

export function DailyChart({ data }: { data: DailyPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-ink-500">
        Zatiaľ nemáme namerané dáta.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="sharedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.shared} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLORS.shared} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ebedf1" vertical={false} />
        <XAxis
          dataKey="day"
          tickFormatter={formatDay}
          tick={{ fontSize: 12, fill: "#6b7080" }}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7080" }}
          tickLine={false}
          axisLine={false}
          unit=" kWh"
          width={70}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v) => formatDay(String(v))}
          formatter={(value, name) => [
            `${Number(value ?? 0).toFixed(1)} kWh`,
            String(name),
          ]}
        />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
        <Area
          type="monotone"
          dataKey="consumption"
          name="Spotreba"
          stroke={COLORS.consumption}
          fill="transparent"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="shared"
          name="Zo zdieľania"
          stroke={COLORS.shared}
          fill="url(#sharedFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HourlyProfileChart({ data }: { data: HourlyPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-ink-500">
        Zatiaľ nemáme dosť dát na zostavenie profilu.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="#ebedf1" vertical={false} />
        <XAxis
          dataKey="hour"
          tickFormatter={(h) => `${h}:00`}
          tick={{ fontSize: 12, fill: "#6b7080" }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7080" }}
          tickLine={false}
          axisLine={false}
          unit=" kW"
          width={62}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(h) => `${h}:00 – ${Number(h) + 1}:00`}
          formatter={(value, name) => [
            `${Number(value ?? 0).toFixed(2)} kW`,
            String(name),
          ]}
        />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
        <Bar
          dataKey="consumption"
          name="Priemerná spotreba"
          fill={COLORS.consumption}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="shared"
          name="Kryté zdieľaním"
          fill={COLORS.shared}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
