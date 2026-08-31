import "server-only";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  consumptionData,
  documents,
  invoices,
  leads,
  meteringPoints,
  sharingGroupMembers,
  sharingGroups,
  users,
} from "@/lib/db/schema";

/** Prehľadové čísla pre správcovskú sekciu. */
export async function getAdminStats() {
  const [[userCount], [pointCount], [groupCount], [intervalCount]] =
    await Promise.all([
      db.select({ value: sql<string>`count(*)` }).from(users),
      db.select({ value: sql<string>`count(*)` }).from(meteringPoints),
      db.select({ value: sql<string>`count(*)` }).from(sharingGroups),
      db.select({ value: sql<string>`count(*)` }).from(consumptionData),
    ]);

  return {
    users: Number(userCount?.value ?? 0),
    meteringPoints: Number(pointCount?.value ?? 0),
    groups: Number(groupCount?.value ?? 0),
    intervals: Number(intervalCount?.value ?? 0),
  };
}

export async function getPendingPoints() {
  return db
    .select({
      id: meteringPoints.id,
      eic: meteringPoints.eic,
      label: meteringPoints.label,
      type: meteringPoints.type,
      createdAt: meteringPoints.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(meteringPoints)
    .leftJoin(users, eq(users.id, meteringPoints.userId))
    .where(eq(meteringPoints.status, "caka"))
    .orderBy(desc(meteringPoints.createdAt));
}

export async function getRecentLeads(limit = 25) {
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
}

/* ------------------------------------------------------------------ */
/* Používatelia                                                        */
/* ------------------------------------------------------------------ */

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "klient" | "admin";
  emailVerified: boolean;
  createdAt: Date;
  pointCount: number;
  pendingCount: number;
};

/**
 * Zoznam všetkých používateľov s počtom odberných miest.
 * Počty sa rátajú poddotazmi, aby zoznam nevyžadoval N+1 dopytov.
 */
export async function getAllUsers(): Promise<AdminUserRow[]> {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      // LEFT JOIN + agregácia namiesto korelovaných poddotazov: count()
      // ignoruje NULL, takže používateľ bez miest vyjde na nulu sám.
      pointCount: sql<string>`count(${meteringPoints.id})`,
      pendingCount: sql<string>`count(${meteringPoints.id}) filter (where ${meteringPoints.status} = 'caka')`,
    })
    .from(users)
    .leftJoin(meteringPoints, eq(meteringPoints.userId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  return rows.map((r) => ({
    ...r,
    pointCount: Number(r.pointCount),
    pendingCount: Number(r.pendingCount),
  }));
}

/** Kompletný profil jedného používateľa pre správcu. */
export async function getUserDetail(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  const [points, userInvoices, userDocuments, groups, history] =
    await Promise.all([
      db
        .select()
        .from(meteringPoints)
        .where(eq(meteringPoints.userId, userId))
        .orderBy(desc(meteringPoints.createdAt)),

      db
        .select()
        .from(invoices)
        .where(eq(invoices.userId, userId))
        .orderBy(desc(invoices.periodStart)),

      db
        .select()
        .from(documents)
        .where(eq(documents.userId, userId))
        .orderBy(desc(documents.createdAt)),

      db
        .select({
          groupName: sharingGroups.name,
          edcCode: sharingGroups.edcCode,
          allocationKey: sharingGroups.allocationKey,
          pointLabel: meteringPoints.label,
          sharePercent: sharingGroupMembers.sharePercent,
        })
        .from(sharingGroupMembers)
        .innerJoin(
          sharingGroups,
          eq(sharingGroups.id, sharingGroupMembers.groupId),
        )
        .innerJoin(
          meteringPoints,
          eq(meteringPoints.id, sharingGroupMembers.meteringPointId),
        )
        .where(eq(meteringPoints.userId, userId)),

      // Dopyty z webu spárované cez e-mail — ukazujú, ako sa zákazník
      // dostal k registrácii a čo si predtým overoval.
      db
        .select()
        .from(leads)
        .where(eq(leads.email, user.email))
        .orderBy(desc(leads.createdAt)),
    ]);

  // Súhrn nameraných dát, aby správca videl, či miesto reálne posiela údaje.
  const pointIds = points.map((p) => p.id);
  let measurements = { intervals: 0, firstAt: null as Date | null, lastAt: null as Date | null };

  if (pointIds.length > 0) {
    const [m] = await db
      .select({
        intervals: sql<string>`count(*)`,
        firstAt: sql<Date | null>`min(${consumptionData.intervalStart})`,
        lastAt: sql<Date | null>`max(${consumptionData.intervalStart})`,
      })
      .from(consumptionData)
      .where(inArray(consumptionData.meteringPointId, pointIds));

    measurements = {
      intervals: Number(m?.intervals ?? 0),
      firstAt: m?.firstAt ?? null,
      lastAt: m?.lastAt ?? null,
    };
  }

  return { user, points, invoices: userInvoices, documents: userDocuments, groups, history, measurements };
}
