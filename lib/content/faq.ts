export type FaqCategory =
  | "zaklady"
  | "registracia"
  | "peniaze"
  | "technika"
  | "zmluva";

export const faqCategories: Record<FaqCategory, string> = {
  zaklady: "Základy zdieľania",
  registracia: "Registrácia a spustenie",
  peniaze: "Ceny, faktúry a dane",
  technika: "Technické podmienky",
  zmluva: "Zmluva a ukončenie",
};

export type FaqItem = {
  question: string;
  answer: string;
  category: FaqCategory;
  /** Zobraziť medzi najčastejšími na domovskej stránke. */
  featured?: boolean;
};

export const faqItems: FaqItem[] = [
  {
    category: "zaklady",
    featured: true,
    question: "Musím kvôli zdieľaniu zmeniť dodávateľa elektriny?",
    answer:
      "Nie. Zmluvu s doterajším dodávateľom si necháte a naďalej od neho odoberáte elektrinu aj faktúru. Zdieľanie beží ako samostatná vrstva nad meraním — zdieľané kilowatthodiny sa vám z faktúry dodávateľa odpočítajú, pretože ich už dodal niekto zo skupiny.",
  },
  {
    category: "zaklady",
    featured: true,
    question: "Ako sa elektrina dostane z cudzej strechy ku mne?",
    answer:
      "Fyzicky nijako — a to je pointa. Elektrina tečie distribučnou sieťou ako doteraz. Zdieľanie je účtovná operácia: Energetické dátové centrum (EDC), ktoré prevádzkuje OKTE, porovná v každom 15-minútovom intervale výrobu a spotrebu členov skupiny a podľa alokačného kľúča rozhodne, komu sa ktorá kilowatthodina priradí.",
  },
  {
    category: "zaklady",
    featured: true,
    question: "Môžem zdieľať s niekým na druhom konci Slovenska?",
    answer:
      "Áno. Od roku 2026 nie ste viazaní na susedov ani na jednu distribučnú oblasť. Prebytok zo strechy v Pezinku môže pokryť spotrebu v Michalovciach. Vzdialenosť nehrá rolu, pretože sa nepresúva elektrina, ale nárok na ňu.",
  },
  {
    category: "zaklady",
    question: "Čo je alokačný kľúč?",
    answer:
      "Pravidlo, podľa ktorého sa prebytok v skupine rozdelí medzi odberné miesta. Pomerný kľúč rozdelí prebytok podľa aktuálnej spotreby jednotlivých členov, statický podľa vopred dohodnutých percent, prioritný uprednostní vybrané miesta. Kľúč si nastavujete pri vstupe do skupiny a dá sa zmeniť.",
  },
  {
    category: "zaklady",
    question: "Čo sa stane, keď skupina nemá dosť prebytkov?",
    answer:
      "Zvyšok spotreby vám bez prerušenia dodá váš pôvodný dodávateľ za vašu bežnú cenu. Zdieľanie nikdy nespôsobí výpadok — v najhoršom prípade v danom intervale jednoducho nič neušetríte.",
  },
  {
    category: "registracia",
    featured: true,
    question: "Ako dlho trvá, kým sa zdieľanie spustí?",
    answer:
      "Samotná registrácia zaberie približne 10 minút. Potom overíme odberné miesto v registri a zaregistrujeme vás do skupiny v EDC. Od podpisu po prvú zdieľanú kilowatthodinu to býva niekoľko pracovných dní, v závislosti od distribútora.",
  },
  {
    category: "registracia",
    question: "Čo potrebujem k registrácii?",
    answer:
      "EIC kód odberného miesta, ktorý nájdete na faktúre od dodávateľa elektriny, a bežné identifikačné údaje. Ak ste výrobca, potrebujeme aj EIC kód odovzdávacieho miesta a inštalovaný výkon fotovoltiky.",
  },
  {
    category: "technika",
    featured: true,
    question: "Potrebujem inteligentný elektromer?",
    answer:
      "Áno. Zdieľanie stojí na 15-minútových meraných dátach, ktoré vie poskytnúť len inteligentný merací systém (IMS). Ten na odbernom mieste inštaluje distribútor. Či ho máte, si viete overiť na našej stránke overenia odberného miesta zadaním EIC kódu.",
  },
  {
    category: "technika",
    question: "Musím si kupovať nejaké zariadenie?",
    answer:
      "Nie. Nepotrebujete batériu, wallbox ani žiadnu ďalšiu elektroniku. Všetko beží nad dátami z elektromera, ktorý už na mieste je.",
  },
  {
    category: "technika",
    question: "Funguje zdieľanie aj v bytovom dome?",
    answer:
      "Áno, ak má byt vlastné odberné miesto s inteligentným meraním. Zdieľať sa dá aj medzi bytmi v jednom dome, napríklad z fotovoltiky na spoločnej streche.",
  },
  {
    category: "peniaze",
    featured: true,
    question: "Koľko to stojí?",
    answer:
      "Za členstvo v skupine neplatíte mesačný paušál ani vstupný poplatok. Ako spotrebiteľ platíte za zdieľanú elektrinu dohodnutú cenu za MWh, ako výrobca dostávate za prebytok dohodnutú výkupnú cenu. Zúčtovanie prebieha mesačne podľa nameraných dát z EDC.",
  },
  {
    category: "peniaze",
    question: "Musím príjem z predaja prebytkov zdaňovať?",
    answer:
      "Ak ste fyzická osoba a váš ročný príjem z predaja prebytkov nepresiahne 500 €, nemusíte ho zdaňovať ani si zakladať živnosť. Nad touto hranicou sa zdaňuje len suma, ktorá ju presahuje. Pri vyšších objemoch odporúčame overiť situáciu s daňovým poradcom.",
  },
  {
    category: "peniaze",
    question: "Koľko faktúr budem dostávať?",
    answer:
      "Dve. Jednu od svojho pôvodného dodávateľa za elektrinu, ktorú vám dodal on, a jednu od nás za zdieľanú elektrinu. Súčet je nižší než pôvodná jedna faktúra — v tom je úspora.",
  },
  {
    category: "zmluva",
    featured: true,
    question: "Som niečím viazaný? Ako to ukončím?",
    answer:
      "Zmluva je bez viazanosti a bez výpovednej pokuty. Ukončiť ju môžete kedykoľvek s mesačnou výpovednou lehotou. Po ukončení sa jednoducho vrátite k pôvodnému stavu — dodávateľa ste nikdy nemenili.",
  },
  {
    category: "zmluva",
    question: "Čo sa stane, keď sa presťahujem?",
    answer:
      "Odberné miesto je viazané na adresu, nie na osobu. Pri sťahovaní pôvodné miesto zo skupiny odhlásime a nové po overení pridáme. Stačí nám dať vedieť.",
  },
  {
    category: "zmluva",
    question: "Kto vidí moje dáta o spotrebe?",
    answer:
      "Vaše 15-minútové dáta spracúvame výhradne na účel zúčtovania zdieľania. Ostatní členovia skupiny vidia len súhrnné údaje za skupinu, nie vašu individuálnu spotrebu. Podrobnosti sú v zásadách ochrany osobných údajov.",
  },
];

export const featuredFaq = faqItems.filter((i) => i.featured);
