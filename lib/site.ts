export const siteConfig = {
  name: "PRUUD",
  tagline: "Energia, ktorá spája",
  description:
    "Zdieľanie elektriny na Slovensku. Odoberajte lacnejšiu elektrinu zo solárnych prebytkov alebo speňažte tie svoje — bez zmeny dodávateľa a bez viazanosti.",
  url: "https://www.pruud.sk",
  // ⚠️ PLACEHOLDER — nahradiť reálnymi údajmi spoločnosti
  company: {
    legalName: "PRUUD s.r.o.",
    street: "Placeholder 1",
    city: "Bratislava",
    zip: "811 01",
    ico: "00000000",
    dic: "0000000000",
    icDph: "SK0000000000",
    ursoLicence: "0000/2026/E-EL",
  },
  contact: {
    email: "info@pruud.sk",
    supportEmail: "podpora@pruud.sk",
    phone: "+421 900 000 000",
  },
} as const;

export type Product = {
  slug: string;
  name: string;
  short: string;
  audience: string;
  headline: string;
  lead: string;
  highlight: string;
  highlightLabel: string;
  icon: "producer" | "consumer" | "infinite";
};

export const products: Product[] = [
  {
    slug: "odber",
    name: "PRUUD ODBER",
    short: "Odber",
    audience: "Domácnosti a firmy bez fotovoltiky",
    headline: "Odoberajte solárnu elektrinu bez toho, aby ste mali panely",
    lead: "Napojíme vás na skupinu, v ktorej vznikajú solárne prebytky. Cez deň odoberáte lacnejšiu elektrinu — bez zmeny dodávateľa a bez investície.",
    highlight: "až 35 %",
    highlightLabel: "úspora na dennej spotrebe",
    icon: "consumer",
  },
  {
    slug: "vyroba",
    name: "PRUUD VÝROBA",
    short: "Výroba",
    audience: "Majitelia fotovoltiky",
    headline: "Prestaňte darovať prebytky do siete",
    lead: "Elektrinu, ktorú práve nespotrebujete, predáte členom skupiny za dohodnutú cenu. Bez nových zariadení a bez viazanosti.",
    highlight: "až 55 €",
    highlightLabel: "za MWh prebytku",
    icon: "producer",
  },
  {
    slug: "kombi",
    name: "PRUUD KOMBI",
    short: "Kombi",
    audience: "Obce, školy a firmy s viacerými odbernými miestami",
    headline: "Zdieľajte energiu medzi vlastnými budovami",
    lead: "Výroba na streche školy pokryje spotrebu obecného úradu aj športovej haly. Čo ostane, predáte do skupiny.",
    highlight: "1 skupina",
    highlightLabel: "pre všetky vaše miesta",
    icon: "infinite",
  },
];

export const mainNav = [
  {
    label: "Riešenia",
    href: "/riesenia",
    children: products.map((p) => ({
      label: p.name,
      href: `/${p.slug}`,
      description: p.audience,
    })),
  },
  { label: "Ako to funguje", href: "/ako-to-funguje" },
  { label: "Cenník", href: "/cennik" },
  { label: "Prípadové štúdie", href: "/pripadove-studie" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

export const footerNav = [
  {
    title: "Riešenia",
    links: [
      ...products.map((p) => ({ label: p.name, href: `/${p.slug}` })),
      { label: "Overenie odberného miesta", href: "/overenie-miesta" },
    ],
  },
  {
    title: "Spoločnosť",
    links: [
      { label: "O nás", href: "/o-nas" },
      { label: "Ako to funguje", href: "/ako-to-funguje" },
      { label: "Prípadové štúdie", href: "/pripadove-studie" },
      { label: "Blog", href: "/blog" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  {
    title: "Podpora",
    links: [
      { label: "Časté otázky", href: "/faq" },
      { label: "Slovník pojmov", href: "/slovnik" },
      { label: "Cenník", href: "/cennik" },
      { label: "Dokumenty", href: "/dokumenty" },
    ],
  },
  {
    title: "Právne",
    links: [
      { label: "Obchodné podmienky", href: "/obchodne-podmienky" },
      { label: "Ochrana osobných údajov", href: "/ochrana-osobnych-udajov" },
      { label: "Reklamačný poriadok", href: "/dokumenty#reklamacie" },
    ],
  },
];
