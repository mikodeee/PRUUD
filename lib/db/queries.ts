import "server-only";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  consumptionData,
  documents,
  invoices,
  meteringPoints,
  sharingGroupMembers,
  sharingGroups,
} from "@/lib/db/schema";

/*
 * Dopyty pre portál.
 *
 * 15-minútové dáta sa nikdy neposielajú do prehliadača v surovej podobe —
 * jedno odberné miesto má ~35 000 riadkov za rok. Všetko agregujeme
 * priamo v Postgrese a do klienta ide už len denný alebo hodinový rad.
 */

export async function getMeteringPoints(userId: string) {
  return db
    .select()
    .from(meteringPoints)
    .where(eq(meteringPoints.userId, userId))
    .orderBy(meteringPoints.createdAt);
}

async function pointIdsFor(userId: string) {
  const points = await db
    .select({ id: meteringPoints.id })
    .from(meteringPoints)
    .where(eq(meteringPoints.userId, userId));
  return points.map((p) => p.id);
}

export type Summary = {
  consumptionKwh: number;
  productionKwh: number;
  sharedKwh: number;
  /** Podiel spotreby pokrytý zdieľaním (0–1). */
  coverage: number;
};

/** Súhrn za posledných `days` dní naprieč všetkými miestami používateľa. */
export async function getSummary(userId: string, days = 30): Promise<Summary> {
  const ids = await pointIdsFor(userId);
  if (ids.length === 0) {
    return { consumptionKwh: 0, productionKwh: 0, sharedKwh: 0, coverage: 0 };
  }

  const since = new Date(Date.now() - days * 86_400_000);

  const [row] = await db
    .select({
      consumption: sql<string>`coalesce(sum(${consumptionData.consumptionKwh}), 0)`,
      production: sql<string>`coalesce(sum(${consumptionData.productionKwh}), 0)`,
      shared: sql<string>`coalesce(sum(${consumptionData.sharedKwh}), 0)`,
    })
    .from(consumptionData)
    .where(
      and(
        inArray(consumptionData.meteringPointId, ids),
        gte(consumptionData.intervalStart, since),
      ),
    );

  const consumptionKwh = Number(row?.consumption ?? 0);
  const sharedKwh = Number(row?.shared ?? 0);

  return {
    consumptionKwh,
    productionKwh: Number(row?.production ?? 0),
    sharedKwh,
    coverage: consumptionKwh > 0 ? sharedKwh / consumptionKwh : 0,
  };
}

export type DailyPoint = {
  day: string;
  consumption: number;
  production: number;
  shared: number;
};

/** Denný rad pre graf. Agregácia prebieha v databáze, nie v JS. */
export async function getDailySeries(
  userId: string,
  days = 30,
  meteringPointId?: string,
): Promise<DailyPoint[]> {
  const ids = meteringPointId ? [meteringPointId] : await pointIdsFor(userId);
  if (ids.length === 0) return [];

  const since = new Date(Date.now() - days * 86_400_000);

  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${consumptionData.intervalStart}), 'YYYY-MM-DD')`,
      consumption: sql<string>`sum(${consumptionData.consumptionKwh})`,
      production: sql<string>`sum(${consumptionData.productionKwh})`,
      shared: sql<string>`sum(${consumptionData.sharedKwh})`,
    })
    .from(consumptionData)
    .where(
      and(
        inArray(consumptionData.meteringPointId, ids),
        gte(consumptionData.intervalStart, since),
      ),
    )
    .groupBy(sql`date_trunc('day', ${consumptionData.intervalStart})`)
    .orderBy(sql`date_trunc('day', ${consumptionData.intervalStart})`);

  return rows.map((r) => ({
    day: r.day,
    consumption: Number(r.consumption),
    production: Number(r.production),
    shared: Number(r.shared),
  }));
}

export type HourlyPoint = { hour: number; consumption: number; shared: number };

/** Priemerný denný profil — ukazuje, kedy cez deň zdieľanie naozaj funguje. */
export async function getHourlyProfile(
  userId: string,
  days = 30,
): Promise<HourlyPoint[]> {
  const ids = await pointIdsFor(userId);
  if (ids.length === 0) return [];

  const since = new Date(Date.now() - days * 86_400_000);

  const rows = await db
    .select({
      hour: sql<string>`extract(hour from ${consumptionData.intervalStart})`,
      consumption: sql<string>`avg(${consumptionData.consumptionKwh}) * 4`,
      shared: sql<string>`avg(${consumptionData.sharedKwh}) * 4`,
    })
    .from(consumptionData)
    .where(
      and(
        inArray(consumptionData.meteringPointId, ids),
        gte(consumptionData.intervalStart, since),
      ),
    )
    .groupBy(sql`extract(hour from ${consumptionData.intervalStart})`)
    .orderBy(sql`extract(hour from ${consumptionData.intervalStart})`);

  return rows.map((r) => ({
    hour: Number(r.hour),
    consumption: Number(r.consumption),
    shared: Number(r.shared),
  }));
}

export async function getInvoices(userId: string) {
  return db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, userId))
    .orderBy(desc(invoices.periodStart));
}

export async function getDocuments(userId: string) {
  return db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt));
}

/** Skupiny zdieľania, v ktorých má používateľ aspoň jedno miesto. */
export async function getSharingGroupsFor(userId: string) {
  const ids = await pointIdsFor(userId);
  if (ids.length === 0) return [];

  const rows = await db
    .select({
      groupId: sharingGroups.id,
      groupName: sharingGroups.name,
      edcCode: sharingGroups.edcCode,
      allocationKey: sharingGroups.allocationKey,
      pointLabel: meteringPoints.label,
      pointType: meteringPoints.type,
      sharePercent: sharingGroupMembers.sharePercent,
    })
    .from(sharingGroupMembers)
    .innerJoin(sharingGroups, eq(sharingGroups.id, sharingGroupMembers.groupId))
    .innerJoin(
      meteringPoints,
      eq(meteringPoints.id, sharingGroupMembers.meteringPointId),
    )
    .where(inArray(sharingGroupMembers.meteringPointId, ids));

  // Zoskupenie po skupinách, aby stránka nemusela riešiť ploché riadky.
  const grouped = new Map<
    string,
    {
      id: string;
      name: string;
      edcCode: string | null;
      allocationKey: string;
      members: Array<{ label: string; type: string; sharePercent: string | null }>;
    }
  >();

  for (const row of rows) {
    const existing = grouped.get(row.groupId) ?? {
      id: row.groupId,
      name: row.groupName,
      edcCode: row.edcCode,
      allocationKey: row.allocationKey,
      members: [],
    };
    existing.members.push({
      label: row.pointLabel,
      type: row.pointType,
      sharePercent: row.sharePercent,
    });
    grouped.set(row.groupId, existing);
  }

  return [...grouped.values()];
}
