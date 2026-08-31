export type GlossaryTerm = {
  slug: string;
  term: string;
  short: string;
  definition: string;
  related?: string[];
};

export const glossary: GlossaryTerm[] = [
  {
    slug: "eic-kod",
    term: "EIC kód",
    short: "Jedinečný 16-znakový identifikátor odberného miesta.",
    definition:
      "Energy Identification Code je medzinárodný identifikátor používaný v energetike. Slovenské odberné miesta majú kód s 16 znakmi začínajúci číslicami 24, ktoré označujú Slovensko ako vydávajúcu kanceláriu. Posledný znak býva kontrolný a počíta sa z predchádzajúcich pätnástich. EIC kód nájdete na faktúre od dodávateľa elektriny.",
    related: ["odberne-miesto", "ims"],
  },
  {
    slug: "edc",
    term: "EDC — Energetické dátové centrum",
    short: "Systém, ktorý zdieľanie technicky vykonáva.",
    definition:
      "Energetické dátové centrum prevádzkuje spoločnosť OKTE. Zbiera 15-minútové namerané dáta zo všetkých inteligentných meračov, porovnáva výrobu a spotrebu členov skupiny zdieľania a podľa alokačného kľúča rozhoduje, komu sa ktorá kilowatthodina priradí. Zriadenie a prevádzka skupiny v EDC sú bezplatné.",
    related: ["okte", "alokacny-kluc", "interval"],
  },
  {
    slug: "okte",
    term: "OKTE",
    short: "Organizátor krátkodobého trhu s elektrinou.",
    definition:
      "Akciová spoločnosť, ktorá na Slovensku organizuje krátkodobý trh s elektrinou a zároveň prevádzkuje Energetické dátové centrum. Je to neutrálny prevádzkovateľ infraštruktúry, nie dodávateľ elektriny.",
    related: ["edc"],
  },
  {
    slug: "ims",
    term: "IMS — inteligentný merací systém",
    short: "Elektromer, ktorý meria v 15-minútových intervaloch.",
    definition:
      "Inteligentný merací systém zaznamenáva spotrebu a výrobu v štvrťhodinovom rozlíšení a odosiela dáta distribútorovi. Bez neho zdieľanie nie je možné, pretože nie je z čoho počítať. Inštaluje ho distribútor, nie dodávateľ ani my.",
    related: ["odberne-miesto", "interval"],
  },
  {
    slug: "interval",
    term: "15-minútový interval",
    short: "Základná časová jednotka celého zdieľania.",
    definition:
      "Zúčtovacia perióda, v ktorej sa porovnáva výroba a spotreba. Zdieľať sa dá len to, čo vzniklo a bolo spotrebované v tom istom intervale — prebytok z poludnia nepokryje spotrebu o osemnástej. Práve preto záleží na tom, koľko vašej spotreby padne na slnečné hodiny.",
    related: ["edc", "alokacny-kluc"],
  },
  {
    slug: "alokacny-kluc",
    term: "Alokačný kľúč",
    short: "Pravidlo, ako sa prebytok rozdelí medzi členov skupiny.",
    definition:
      "Určuje, kto dostane koľko, keď je prebytku menej než dopytu. Pomerný kľúč delí podľa aktuálnej spotreby, statický podľa vopred dohodnutých percent a prioritný uprednostní vybrané odberné miesta. Kľúč sa nastavuje pri vzniku skupiny a dá sa neskôr zmeniť.",
    related: ["edc", "skupina-zdielania"],
  },
  {
    slug: "skupina-zdielania",
    term: "Skupina zdieľania",
    short: "Množina odberných miest, ktoré si medzi sebou zdieľajú elektrinu.",
    definition:
      "Registruje sa v EDC a môže obsahovať výrobcov aj spotrebiteľov. Od roku 2026 nie je viazaná na jednu distribučnú oblasť ani na geografickú blízkosť — členovia môžu byť kdekoľvek na Slovensku.",
    related: ["edc", "alokacny-kluc", "energeticke-spolocenstvo"],
  },
  {
    slug: "energeticke-spolocenstvo",
    term: "Energetické spoločenstvo",
    short: "Právna forma komunity, ktorá spoločne vyrába a zdieľa energiu.",
    definition:
      "Združenie občanov, obcí alebo malých podnikov, ktorého cieľom nie je zisk, ale prínos pre členov a lokalitu. Zdieľať elektrinu sa dá aj bez založenia spoločenstva — stačí skupina zdieľania v EDC.",
    related: ["skupina-zdielania"],
  },
  {
    slug: "odberne-miesto",
    term: "Odberné miesto",
    short: "Miesto, kde sa elektrina odoberá zo siete a meria.",
    definition:
      "Fyzická lokalita s vlastným elektromerom a vlastným EIC kódom — byt, dom, prevádzka. Zdieľanie sa vždy nastavuje na odberné miesto, nie na osobu, takže pri sťahovaní sa musí prehlásiť.",
    related: ["eic-kod", "odovzdavacie-miesto", "ims"],
  },
  {
    slug: "odovzdavacie-miesto",
    term: "Odovzdávacie miesto",
    short: "Miesto, kde sa vyrobená elektrina odovzdáva do siete.",
    definition:
      "Náprotivok odberného miesta pre výrobcov. Má vlastný EIC kód a práve cezeň sa do skupiny dostáva prebytok z vašej fotovoltiky.",
    related: ["eic-kod", "prebytok"],
  },
  {
    slug: "prebytok",
    term: "Prebytok",
    short: "Vyrobená elektrina, ktorú ste v danom intervale nespotrebovali.",
    definition:
      "Rozdiel medzi výrobou a vlastnou spotrebou v štvrťhodinovom intervale. Bez zdieľania odchádza do siete za výrazne nižšiu cenu, než akú má elektrina, ktorú neskôr nakúpite späť.",
    related: ["odovzdavacie-miesto", "virtualna-bateria"],
  },
  {
    slug: "virtualna-bateria",
    term: "Virtuálna batéria",
    short: "Služba, ktorá prebytok uloží na neskoršie odobratie.",
    definition:
      "Prebytok odovzdaný v lete si môžete odobrať v zime, zaplatíte však distribučné poplatky a poplatok za službu. Zdieľanie prebytok speňaží hneď a obe služby sa dajú kombinovať — čo skupina neodoberie, môže ísť do batérie.",
    related: ["prebytok"],
  },
  {
    slug: "vlastna-spotreba",
    term: "Vlastná spotreba",
    short: "Podiel výroby spotrebovaný priamo v mieste vzniku.",
    definition:
      "Bez batérie a bez riadenia spotrebičov býva okolo 30 %. Zvyšok je prebytok. Čím vyššia vlastná spotreba, tým menej máte čo zdieľať — ale tým menej aj nakupujete.",
    related: ["prebytok"],
  },
  {
    slug: "kwp",
    term: "kWp",
    short: "Špičkový výkon fotovoltickej inštalácie.",
    definition:
      "Kilowatt-peak udáva výkon panelov za štandardných testovacích podmienok. Na Slovensku 1 kWp vyrobí približne 1 000 až 1 100 kWh za rok, v závislosti od orientácie a sklonu strechy.",
    related: ["prebytok"],
  },
];

export function getTerm(slug: string) {
  return glossary.find((t) => t.slug === slug);
}
