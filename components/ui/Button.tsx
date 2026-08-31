import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

/*
 * Primárne tlačidlo používa gold-600, nie značkovú gold-500.
 * Biely text na gold-500 má kontrast 4,08:1 (pod AA), na gold-600 má 5,73:1.
 * Značková gold-500 zostáva pre logo, ikony a veľké nadpisy.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-gold-600 text-white hover:bg-gold-700 focus-visible:outline-gold-600",
  secondary:
    "bg-ink-950 text-white hover:bg-ink-800 focus-visible:outline-ink-950",
  ghost:
    "bg-transparent text-ink-950 ring-1 ring-inset ring-ink-300 hover:bg-ink-50 focus-visible:outline-ink-950",
  onDark:
    "bg-white text-ink-950 hover:bg-gold-100 focus-visible:outline-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-8 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
