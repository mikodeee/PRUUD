"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [renderedPath, setRenderedPath] = useState(pathname);

  // Po prechode na inú stránku zavrieť mobilné menu. Stav upravujeme
  // počas renderu namiesto v efekte — inak by sa menu na okamih ukázalo
  // otvorené na novej stránke a vynútil by sa druhý render.
  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-paper/85 backdrop-blur-md">
      <div className="container-pruud flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          className="rounded-sm text-[1.15rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-600"
          aria-label={`${"PRUUD"} — domov`}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Hlavná navigácia">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600",
                  active
                    ? "bg-ink-100 text-ink-950"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-950",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/portal/prihlasenie"
            className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            Prihlásenie
          </Link>
          <ButtonLink href="/registracia" size="sm">
            Registrácia
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 rounded-full p-2 text-ink-950 lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-ink-200 bg-paper lg:hidden"
          aria-label="Mobilná navigácia"
        >
          <div className="container-pruud flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink-800 hover:bg-ink-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-3 border-t border-ink-200 pt-4">
              <Link
                href="/portal/prihlasenie"
                className="rounded-lg px-3 py-2 text-base font-medium text-ink-600"
              >
                Prihlásenie
              </Link>
              <ButtonLink href="/registracia">Registrácia</ButtonLink>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
