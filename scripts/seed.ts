import bcrypt from "bcryptjs";
import * as schema from "../lib/db/schema.ts";
import { connect } from "./db-connect.ts";

/*
 * Demo dáta pre portál. Generuje 180 dní 15-minútových intervalov
 * s realistickým tvarom krivky: solárna produkcia ako zvon okolo
 * poludnia so sezónnou amplitúdou, spotreba s ranným a večerným vrcholom.
 */

const conn = await connect();
const db = conn.db;
console.log(`Seedujem: ${conn.label}`);

const DAYS = 180;
const INTERVALS_PER_DAY = 96; // 24 h × 4

/** Sezónny faktor: v lete ~1,3, v zime ~0,45. */
function seasonalFactor(date: Date) {
  const dayOfYear = Math.floor(
    (date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86_400_000,
  );
  // Vrchol okolo 172. dňa (letný slnovrat).
  return 0.87 + 0.43 * Math.cos(((dayOfYear - 172) / 365) * 2 * Math.PI);
}

/** Výroba FVE v kWh za 15 minút. */
function solarOutput(kwp: number, date: Date, quarter: number) {
  const hour = quarter / 4;
  const season = seasonalFactor(date);
  const dayLength = 7 + 5 * season; // hodín svetla
  const sunrise = 12 - dayLength / 2;
  const sunset = 12 + dayLength / 2;
  if (hour < sunrise || hour > sunset) return 0;

  const phase = (hour - sunrise) / (sunset - sunrise); // 0..1
  const bell = Math.sin(phase * Math.PI) ** 1.6;
  // Oblačnosť: pseudonáhodné, ale deterministické pre daný deň.
  const cloud = 0.55 + 0.45 * Math.abs(Math.sin(date.getUTCDate() * 2.7 + 1.3));
  return (kwp * bell * season * cloud) / 4;
}

/** Spotreba domácnosti v kWh za 15 minút. */
function householdLoad(annualMwh: number, quarter: number, date: Date) {
  const hour = quarter / 4;
  const base = 0.35;
  const morning = 1.5 * Math.exp(-(((hour - 7) / 1.4) ** 2));
  const evening = 2.2 * Math.exp(-(((hour - 19) / 2.0) ** 2));
  const shape = base + morning + evening;
  // Normalizačný faktor tak, aby ročný súčet sedel na zadanú spotrebu.
  const avgShape = 1.05;
  const perQuarter = (annualMwh * 1000) / (365 * INTERVALS_PER_DAY);
  const weekend = [0, 6].includes(date.getUTCDay()) ? 1.15 : 1;
  return (perQuarter * shape * weekend) / avgShape;
}

const n = (v: number) => v.toFixed(4);

async function main() {
  console.log("Čistím existujúce demo dáta…");
  await db.delete(schema.consumptionData);
  await db.delete(schema.sharingGroupMembers);
  await db.delete(schema.invoices);
  await db.delete(schema.documents);
  await db.delete(schema.meteringPoints);
  await db.delete(schema.sharingGroups);
  await db.delete(schema.sessions);
  await db.delete(schema.organizations);
  await db.delete(schema.users);

  const [demo] = await db
    .insert(schema.users)
    .values({
      email: "demo@pruud.sk",
      passwordHash: await bcrypt.hash("demo1234", 10),
      name: "Martin Demo",
      phone: "+421 900 111 222",
      role: "klient",
      emailVerified: true,
    })
    .returning();

  await db.insert(schema.users).values({
    email: "admin@pruud.sk",
    passwordHash: await bcrypt.hash("admin1234", 10),
    name: "Správca PRUUD",
    role: "admin",
    emailVerified: true,
  });

  const [group] = await db
    .insert(schema.sharingGroups)
    .values({
      name: "Skupina Malokarpatská",
      edcCode: "SKG-0001",
      allocationKey: "pomerny",
    })
    .returning();

  const [production] = await db
    .insert(schema.meteringPoints)
    .values({
      eic: "24ZZSPRUUD00001M",
      label: "Rodinný dom — strecha",
      type: "vyroba",
      street: "Vinohradnícka 12",
      city: "Pezinok",
      zip: "902 01",
      distributor: "ZSD",
      installedKwp: "8.00",
      status: "overene",
      userId: demo.id,
    })
    .returning();

  const [consumptionPoint] = await db
    .insert(schema.meteringPoints)
    .values({
      eic: "24ZZSPRUUD00002J",
      label: "Chata Modra",
      type: "odber",
      street: "Harmónia 44",
      city: "Modra",
      zip: "900 01",
      distributor: "ZSD",
      status: "overene",
      userId: demo.id,
    })
    .returning();

  await db.insert(schema.sharingGroupMembers).values([
    { groupId: group.id, meteringPointId: production.id, sharePercent: "60.00" },
    {
      groupId: group.id,
      meteringPointId: consumptionPoint.id,
      sharePercent: "40.00",
    },
  ]);

  console.log(`Generujem ${DAYS} dní 15-minútových dát…`);
  // Časy staviame v UTC. Lokálna aritmetika by na prechode letného času
  // vyrobila neexistujúce hodiny a tým duplicitné intervaly, ktoré porušia
  // unikátny index (metering_point_id, interval_start).
  const today = new Date();
  const startMs = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate() - DAYS,
  );
  const QUARTER_MS = 15 * 60 * 1000;

  const rows: (typeof schema.consumptionData.$inferInsert)[] = [];

  for (let day = 0; day < DAYS; day += 1) {
    for (let q = 0; q < INTERVALS_PER_DAY; q += 1) {
      const ts = new Date(startMs + (day * INTERVALS_PER_DAY + q) * QUARTER_MS);

      // Výrobné miesto: vyrába a zároveň má vlastnú spotrebu.
      const produced = solarOutput(8, ts, q);
      const ownLoad = householdLoad(4.2, q, ts);
      const surplus = Math.max(0, produced - ownLoad);

      // Odberné miesto: spotreba, časť pokrytá prebytkom zo skupiny.
      const chataLoad = householdLoad(2.4, q, ts);
      const shared = Math.min(chataLoad, surplus);

      rows.push({
        meteringPointId: production.id,
        intervalStart: ts,
        consumptionKwh: n(ownLoad),
        productionKwh: n(produced),
        sharedKwh: n(surplus - Math.max(0, surplus - shared)),
      });
      rows.push({
        meteringPointId: consumptionPoint.id,
        intervalStart: ts,
        consumptionKwh: n(chataLoad),
        productionKwh: "0",
        sharedKwh: n(shared),
      });
    }
  }

  const BATCH = 2000;
  for (let i = 0; i < rows.length; i += BATCH) {
    await db.insert(schema.consumptionData).values(rows.slice(i, i + BATCH));
    process.stdout.write(
      `\r  ${Math.min(i + BATCH, rows.length)} / ${rows.length} riadkov`,
    );
  }
  console.log("");

  // Faktúry za posledné tri uzavreté mesiace.
  const now = new Date();
  for (let m = 3; m >= 1; m -= 1) {
    const periodStart = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() - m + 1, 0);
    const net = 40 + m * 12.5;
    const vat = net * 0.23;
    await db.insert(schema.invoices).values({
      userId: demo.id,
      number: `${periodStart.getFullYear()}${String(periodStart.getMonth() + 1).padStart(2, "0")}0001`,
      periodStart,
      periodEnd,
      amountNet: net.toFixed(2),
      amountVat: vat.toFixed(2),
      amountTotal: (net + vat).toFixed(2),
      status: m === 1 ? "vystavena" : "uhradena",
      dueDate: new Date(periodEnd.getTime() + 14 * 86_400_000),
    });
  }

  await db.insert(schema.documents).values([
    {
      userId: demo.id,
      title: "Zmluva o zdieľaní elektriny",
      category: "zmluva",
      sizeBytes: 184_320,
    },
    {
      userId: demo.id,
      title: "Všeobecné obchodné podmienky",
      category: "vop",
      sizeBytes: 96_100,
    },
  ]);

  console.log("Hotovo. Prihlásenie: demo@pruud.sk / demo1234");
  await conn.close();
}

await main();
