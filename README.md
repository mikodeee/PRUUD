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

### Ako sa dostanem do správcovskej sekcie

1. Prihlásiť sa na `/portal/prihlasenie` **správcovským** účtom
2. V ľavom menu pribudne položka **Správa** — vidia ju len účty s rolou
   `admin`, klientom sa nezobrazí
3. **Správa** → **Všetci používatelia** je zoznam všetkých registrovaných;
   kliknutím na meno sa otvorí detail so všetkými údajmi

Rola sa mení priamo v databáze:

```sql
update users set role = 'admin' where email = 'vas@email.sk';
```

Prístup je strážený na serveri, nielen skrytím odkazu — klient, ktorý si
adresu `/portal/admin` napíše ručne, dostane 404.

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

## Nasadenie na Render

Repozitár obsahuje `render.yaml` (Blueprint), ktorý vytvorí web službu
aj Postgres databázu a prepojí ich.

1. Render → **New** → **Blueprint** → vybrať repozitár `mikodeee/PRUUD`
2. Render prečíta `render.yaml` a ponúkne vytvorenie oboch služieb
3. Premenné označené `sync: false` sa vypĺňajú ručne v dashboarde
   (`RESEND_API_KEY`, `NOTIFY_EMAIL`, `EDC_API_URL`, `EDC_API_TOKEN`) —
   bez nich web funguje, len sa správy z formulárov logujú namiesto odosielania
4. Migrácie sa spustia automaticky pri každom štarte

### Databáza a región

Databáza aj webová služba **musia byť v rovnakom regióne**. Render dáva
službám interný hostname (`dpg-…`), ktorý sa mimo vlastného regiónu
nepreloží — štart potom zlyhá na `getaddrinfo ENOTFOUND dpg-…`.

V `render.yaml` je preto `region: frankfurt` uvedený aj v bloku
`databases:`, nielen v `services:`.

Existujúcu databázu presunúť medzi regiónmi nemožno. Ak už vznikla
v nesprávnom regióne, treba ju v Renderi zmazať a nechať blueprint
vytvoriť nanovo — alebo do `DATABASE_URL` vložiť **externý** connection
string, ktorý funguje naprieč regiónmi (za cenu vyššej latencie).

### Na čo pozor pri free pláne

- **Postgres na free pláne po 30 dňoch expiruje.** Pre trvalú prevádzku
  treba platený plán alebo externú databázu (Neon, Supabase).
- **Web služba po nečinnosti zaspí**, prvý request potom trvá aj minútu.
- `preDeployCommand` je platená funkcia, preto migrácie bežia
  v `startCommand`.

### Demo dáta v produkcii

`npm run db:seed` naplní databázu ukážkovými účtami, ktorých heslá sú
uvedené vyššie v tomto súbore — a ten je vo verejnom repozitári.

Pre verejné demo je to v poriadku (všetky dáta sú vymyslené), pre ostrú
prevádzku **seed nespúšťajte** a demo účty zmažte.
