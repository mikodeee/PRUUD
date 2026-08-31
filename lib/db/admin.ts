import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  consumptionData,
  leads,
  meteringPoints,
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
