import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/*
 * Schéma je písaná v Postgres dialekte. Lokálne beží na PGlite (Postgres
 * skompilovaný do WASM, bez servera), v produkcii na Neon/Supabase —
 * rovnaké SQL, mení sa len connection string.
 */

export const userRole = pgEnum("user_role", ["klient", "admin"]);
export const meteringPointType = pgEnum("metering_point_type", [
  "odber",
  "vyroba",
  "kombinovane",
]);
export const verificationStatus = pgEnum("verification_status", [
  "caka",
  "overene",
  "zamietnute",
]);
export const invoiceStatus = pgEnum("invoice_status", [
  "vystavena",
  "uhradena",
  "po_splatnosti",
]);
export const leadKind = pgEnum("lead_kind", [
  "eic-verification",
  "contact",
  "registration",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    phone: text("phone"),
    role: userRole("role").notNull().default("klient"),
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("sessions_token_hash_unique").on(t.tokenHash),
    index("sessions_user_idx").on(t.userId),
  ],
);

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ico: text("ico"),
  dic: text("dic"),
  street: text("street"),
  city: text("city"),
  zip: text("zip"),
  ownerId: uuid("owner_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const meteringPoints = pgTable(
  "metering_points",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eic: text("eic").notNull(),
    label: text("label").notNull(),
    type: meteringPointType("type").notNull(),
    street: text("street"),
    city: text("city"),
    zip: text("zip"),
    /** Distribučná oblasť: ZSD / SSD / VSD. */
    distributor: text("distributor"),
    /** Inštalovaný výkon FVE v kWp — len pre výrobné miesta. */
    installedKwp: numeric("installed_kwp", { precision: 8, scale: 2 }),
    status: verificationStatus("status").notNull().default("caka"),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("metering_points_eic_unique").on(t.eic),
    index("metering_points_user_idx").on(t.userId),
  ],
);

export const sharingGroups = pgTable("sharing_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  /** Kód skupiny v EDC. */
  edcCode: text("edc_code"),
  /** Alokačný kľúč: "pomerny" | "prioritny" | "staticky". */
  allocationKey: text("allocation_key").notNull().default("pomerny"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sharingGroupMembers = pgTable(
  "sharing_group_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => sharingGroups.id, { onDelete: "cascade" }),
    meteringPointId: uuid("metering_point_id")
      .notNull()
      .references(() => meteringPoints.id, { onDelete: "cascade" }),
    /** Podiel pri statickom alokačnom kľúči, v percentách. */
    sharePercent: numeric("share_percent", { precision: 5, scale: 2 }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("group_member_unique").on(t.groupId, t.meteringPointId),
  ],
);

/*
 * 15-minútové intervalové dáta. Jedno odberné miesto vyprodukuje
 * ~35 000 riadkov za rok, takže index na (metering_point_id, interval_start)
 * je nutnosť, nie optimalizácia. Pri raste nad jednotky miliónov riadkov
 * prejsť na mesačné partície — schéma je na to pripravená.
 */
export const consumptionData = pgTable(
  "consumption_data",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meteringPointId: uuid("metering_point_id")
      .notNull()
      .references(() => meteringPoints.id, { onDelete: "cascade" }),
    intervalStart: timestamp("interval_start", { withTimezone: true }).notNull(),
    consumptionKwh: numeric("consumption_kwh", { precision: 12, scale: 4 })
      .notNull()
      .default("0"),
    productionKwh: numeric("production_kwh", { precision: 12, scale: 4 })
      .notNull()
      .default("0"),
    sharedKwh: numeric("shared_kwh", { precision: 12, scale: 4 })
      .notNull()
      .default("0"),
  },
  (t) => [
    uniqueIndex("consumption_point_interval_unique").on(
      t.meteringPointId,
      t.intervalStart,
    ),
    index("consumption_interval_idx").on(t.intervalStart),
  ],
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    number: text("number").notNull(),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
    amountNet: numeric("amount_net", { precision: 12, scale: 2 }).notNull(),
    amountVat: numeric("amount_vat", { precision: 12, scale: 2 }).notNull(),
    amountTotal: numeric("amount_total", { precision: 12, scale: 2 }).notNull(),
    status: invoiceStatus("status").notNull().default("vystavena"),
    dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
    pdfUrl: text("pdf_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("invoices_number_unique").on(t.number),
    index("invoices_user_idx").on(t.userId),
  ],
);

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  fileUrl: text("file_url"),
  sizeBytes: integer("size_bytes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Dopyty z webu: overenia EIC, kontaktný formulár, registrácie. */
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: leadKind("kind").notNull(),
  email: text("email"),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
