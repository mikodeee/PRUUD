import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/sections/ProductLayout";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Napíšte nám alebo zavolajte. Odpovedáme do jedného pracovného dňa.",
};

export default function KontaktPage() {
  return (
    <Section>
      <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="claim text-xs text-gold-600">Kontakt</p>
          <h1 className="mt-6 font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            Ozvite sa nám
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            Nie ste si istí, či sa zdieľanie oplatí práve vám? Napíšte nám
            svoju situáciu a prepočítame ju s vami. Odpovedáme do jedného
            pracovného dňa.
          </p>
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-card border border-ink-200 bg-white p-8">
            <h2 className="font-display text-lg font-semibold text-ink-950">
              Priame kontakty
            </h2>
            <dl className="mt-6 space-y-5">
              <div className="flex gap-4">
                <Mail size={20} className="mt-0.5 shrink-0 text-gold-600" aria-hidden="true" />
                <div>
                  <dt className="text-sm text-ink-500">E-mail</dt>
                  <dd>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-ink-950 underline underline-offset-4 hover:text-gold-700"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone size={20} className="mt-0.5 shrink-0 text-gold-600" aria-hidden="true" />
                <div>
                  <dt className="text-sm text-ink-500">Telefón</dt>
                  <dd>
                    <a
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                      className="text-ink-950 underline underline-offset-4 hover:text-gold-700"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin size={20} className="mt-0.5 shrink-0 text-gold-600" aria-hidden="true" />
                <div>
                  <dt className="text-sm text-ink-500">Adresa</dt>
                  <dd className="text-ink-950">
                    {siteConfig.company.legalName}
                    <br />
                    {siteConfig.company.street}
                    <br />
                    {siteConfig.company.zip} {siteConfig.company.city}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-card bg-ink-950 p-8 text-white">
            <h2 className="font-display text-lg font-semibold">
              Ste obec alebo škola?
            </h2>
            <p className="mt-3 leading-relaxed text-ink-300">
              Pri viacerých budovách je nastavenie skupiny individuálne.
              Napíšte nám a pripravíme prepočet pre vaše konkrétne odberné
              miesta.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
