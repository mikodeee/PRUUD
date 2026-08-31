import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { footerNav, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink-950 text-ink-300">
      <div className="container-pruud py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-block text-[1.2rem]">
              <Logo variant="dark" withTagline />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-400">
              {siteConfig.description}
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="claim text-xs text-gold-400">{group.title}</h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/10 pt-8 text-sm text-ink-400 md:grid-cols-2">
          <div className="space-y-1">
            <p className="font-medium text-ink-200">
              {siteConfig.company.legalName}
            </p>
            <p>
              {siteConfig.company.street}, {siteConfig.company.zip}{" "}
              {siteConfig.company.city}
            </p>
            <p>
              IČO {siteConfig.company.ico} · DIČ {siteConfig.company.dic}
            </p>
            <p>Povolenie ÚRSO č. {siteConfig.company.ursoLicence}</p>
          </div>
          <div className="space-y-1 md:text-right">
            <p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="transition-colors hover:text-white"
              >
                {siteConfig.contact.email}
              </a>
            </p>
            <p>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-white"
              >
                {siteConfig.contact.phone}
              </a>
            </p>
            <p className="pt-2 text-ink-500">
              © {new Date().getFullYear()} {siteConfig.company.legalName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
