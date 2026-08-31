import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/sections/ProductLayout";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Registrácia",
  description:
    "Zaregistrujte sa do zdieľania elektriny. Zaberie to približne 10 minút a nič vás nezaväzuje.",
};

export default function RegistraciaPage() {
  return (
    <Section>
      <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="claim text-xs text-gold-600">Registrácia</p>
          <h1 className="mt-6 font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            Založte si účet
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            Registrácia je bezplatná a nezáväzná. Zmluvu podpisujete až po
            tom, čo overíme vaše odberné miesto a ukážeme vám konkrétny
            prepočet.
          </p>

          <div className="mt-12">
            <RegisterForm />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-card border border-ink-200 bg-white p-8">
            <h2 className="font-display text-lg font-semibold text-ink-950">
              Čo sa stane potom
            </h2>
            <ol className="mt-6 space-y-5">
              {[
                "Overíme, či má vaše odberné miesto inteligentné meranie.",
                "Pripravíme prepočet úspory alebo výnosu pre vašu situáciu.",
                "Ak vám bude sedieť, podpíšete zmluvu a zaradíme vás do skupiny.",
                "Zdieľanie sa spustí do niekoľkých pracovných dní.",
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-semibold text-gold-700">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-ink-600">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-card bg-ink-950 p-8 text-white">
            <h2 className="font-display text-lg font-semibold">
              Nič neriskujete
            </h2>
            <ul className="mt-5 space-y-3">
              {[
                "Registrácia je zadarmo",
                "Nemeníte dodávateľa",
                "Bez viazanosti",
                "Kedykoľvek môžete odísť",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-200">
                  <Check size={18} className="mt-0.5 shrink-0 text-gold-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-ink-600">
            Už máte účet?{" "}
            <Link
              href="/portal/prihlasenie"
              className="font-medium text-gold-700 underline underline-offset-4"
            >
              Prihláste sa
            </Link>
          </p>
        </aside>
      </div>
    </Section>
  );
}
