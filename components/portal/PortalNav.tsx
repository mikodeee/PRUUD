"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Gauge,
  LayoutDashboard,
  MapPin,
  Receipt,
  Settings,
  Share2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/portal", label: "Prehľad", icon: LayoutDashboard },
  { href: "/portal/spotreba", label: "Spotreba", icon: Gauge },
  { href: "/portal/odberne-miesta", label: "Odberné miesta", icon: MapPin },
  { href: "/portal/zdielanie", label: "Zdieľanie", icon: Share2 },
  { href: "/portal/faktury", label: "Faktúry", icon: Receipt },
  { href: "/portal/dokumenty", label: "Dokumenty", icon: FileText },
  { href: "/portal/nastavenia", label: "Nastavenia", icon: Settings },
] as const;

export function PortalNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigácia portálu" className="space-y-1">
      {items.map((item) => {
        // "/portal" by inak ostalo aktívne na každej podstránke.
        const active =
          item.href === "/portal"
            ? pathname === "/portal"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600",
              active
                ? "bg-ink-950 text-white"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-950",
            )}
          >
            <item.icon size={18} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}

      {isAdmin && (
        <>
          <hr className="my-4 border-ink-200" />
          <Link
            href="/portal/admin"
            aria-current={pathname.startsWith("/portal/admin") ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/portal/admin")
                ? "bg-petrol-900 text-white"
                : "text-petrol-900 hover:bg-petrol-50",
            )}
          >
            <Shield size={18} aria-hidden="true" />
            Správa
          </Link>
        </>
      )}
    </nav>
  );
}
