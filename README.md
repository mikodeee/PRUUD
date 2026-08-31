# PRUUD — Energia, ktorá spája

Web a zákaznícky portál pre službu zdieľania elektriny na Slovensku.

## Spustenie

Node.js je nainštalovaný v `~/.local/node` a pridaný do PATH v `~/.zshrc`.
V novom termináli je teda `npm` dostupný priamo.

```bash
npm install
npm run db:migrate   # vytvorí lokálnu databázu
npm run db:seed      # naplní demo dátami
npm run dev          # http://localhost:3000
```

**Demo prihlásenie do portálu**

| Účet | Heslo | Rola |
|---|---|---|
| `demo@pruud.sk` | `demo1234` | klient |
| `admin@pruud.sk` | `admin1234` | správca |

## Skripty

| Príkaz | Čo robí |
|---|---|
| `npm run dev` | vývojový server |
| `npm run build` | produkčný build |
| `npm run typecheck` | kontrola typov |
| `npm run lint` | ESLint |
| `npm test` | testy výpočtovej logiky |
| `npm run db:reset` | zmaže a znova vytvorí lokálnu databázu s demo dátami |

## Architektúra

- **Next.js 16** (App Router, React 19), **TypeScript**, **Tailwind CSS v4**
- Marketingové stránky sú statické, portál sa renderuje na požiadanie za prihlásením
- Obsah blogu a prípadových štúdií je v `content/` ako MDX; FAQ a slovník sú typované dáta v `lib/content/`
- Databáza: **Drizzle ORM** nad Postgres dialektom. Lokálne beží **PGlite**
  (Postgres vo WASM, dáta v `.pglite/`, netreba server). Produkcia = Neon/Supabase,
  mení sa len driver v `lib/db/index.ts`.
- Autentifikácia: vlastné session cookie + bcrypt, `lib/auth.ts`.
  V DB je uložený len SHA-256 odtlačok tokenu.

## Kde sa čo mení

| Chcem zmeniť | Súbor |
|---|---|
| Ceny a cenové pásma | `lib/pricing.ts` |
| Údaje firmy, kontakty, navigáciu | `lib/site.ts` |
| Farby a typografiu | `app/globals.css` |
| Logo | `components/brand/Logo.tsx` |
| Otázky vo FAQ | `lib/content/faq.ts` |
| Slovník pojmov | `lib/content/glossary.ts` |
| Výpočty kalkulačiek | `lib/calculations/index.ts` |

## Čo je zatiaľ ukážkové

Tieto miesta sú vedome označené a treba ich pred spustením nahradiť:

- **Cenník** (`lib/pricing.ts`) — sadzby sú placeholder, na stránke `/cennik` je
  o tom viditeľné upozornenie
- **Údaje firmy** (`lib/site.ts`) — IČO, DIČ, adresa, číslo povolenia ÚRSO
- **Overenie priebehového merania** (`lib/services/meteringRegistry.ts`) — dnes
  deterministický mock, v UI označený ako ukážkový. Napojenie na register
  EDC/OKTE je pripravené jedným miestom v tejto funkcii.
- **Právne dokumenty** — `/obchodne-podmienky` a `/ochrana-osobnych-udajov` sú
  osnovy, záväzné znenie pripraví advokátska kancelária
- **Prípadové štúdie** — čísla sú ilustračné, priamo v texte označené
- **Logo** — wordmark je zostavený zo živého textu, lebo bol dodaný len rastrový
  design manuál. Po dodaní vektoru stačí vymeniť vnútro `Logo.tsx`.
- **PDF faktúr** — generovanie sa pripája s fakturačným systémom

## Nasadenie

Projekt je pripravený na Vercel. Pred nasadením:

1. Nastaviť premenné podľa `.env.example` (`RESEND_API_KEY`, `NOTIFY_EMAIL`)
2. Prepnúť databázu z PGlite na Postgres (Neon/Supabase) v `lib/db/index.ts`
3. Upraviť `siteConfig.url` v `lib/site.ts` na produkčnú doménu
