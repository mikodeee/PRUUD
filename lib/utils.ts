import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formátovanie meny pre slovenské prostredie. */
export function formatEur(value: number, decimals = 0) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat("sk-SK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Bezpečné formátovanie dátumu.
 *
 * Hodnoty z SQL agregácií (min/max) sa vracajú ako reťazce, nie ako Date —
 * Intl.DateTimeFormat.format() na nich hodí RangeError: Invalid time value.
 * Preto normalizujeme vstup a neplatnú hodnotu nahradíme pomlčkou.
 */
export function formatDateSafe(
  value: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  if (value === null || value === undefined) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("sk-SK", options).format(date);
}
