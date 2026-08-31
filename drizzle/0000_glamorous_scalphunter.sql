CREATE TYPE "public"."invoice_status" AS ENUM('vystavena', 'uhradena', 'po_splatnosti');--> statement-breakpoint
CREATE TYPE "public"."lead_kind" AS ENUM('eic-verification', 'contact', 'registration');--> statement-breakpoint
CREATE TYPE "public"."metering_point_type" AS ENUM('odber', 'vyroba', 'kombinovane');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('klient', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('caka', 'overene', 'zamietnute');--> statement-breakpoint
CREATE TABLE "consumption_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metering_point_id" uuid NOT NULL,
	"interval_start" timestamp with time zone NOT NULL,
	"consumption_kwh" numeric(12, 4) DEFAULT '0' NOT NULL,
	"production_kwh" numeric(12, 4) DEFAULT '0' NOT NULL,
	"shared_kwh" numeric(12, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"file_url" text,
	"size_bytes" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"number" text NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"amount_net" numeric(12, 2) NOT NULL,
	"amount_vat" numeric(12, 2) NOT NULL,
	"amount_total" numeric(12, 2) NOT NULL,
	"status" "invoice_status" DEFAULT 'vystavena' NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"pdf_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "lead_kind" NOT NULL,
	"email" text,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metering_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eic" text NOT NULL,
	"label" text NOT NULL,
	"type" "metering_point_type" NOT NULL,
	"street" text,
	"city" text,
	"zip" text,
	"distributor" text,
	"installed_kwp" numeric(8, 2),
	"status" "verification_status" DEFAULT 'caka' NOT NULL,
	"user_id" uuid,
	"organization_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"ico" text,
	"dic" text,
	"street" text,
	"city" text,
	"zip" text,
	"owner_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sharing_group_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"metering_point_id" uuid NOT NULL,
	"share_percent" numeric(5, 2),
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sharing_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"edc_code" text,
	"allocation_key" text DEFAULT 'pomerny' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"role" "user_role" DEFAULT 'klient' NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consumption_data" ADD CONSTRAINT "consumption_data_metering_point_id_metering_points_id_fk" FOREIGN KEY ("metering_point_id") REFERENCES "public"."metering_points"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metering_points" ADD CONSTRAINT "metering_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metering_points" ADD CONSTRAINT "metering_points_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sharing_group_members" ADD CONSTRAINT "sharing_group_members_group_id_sharing_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."sharing_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sharing_group_members" ADD CONSTRAINT "sharing_group_members_metering_point_id_metering_points_id_fk" FOREIGN KEY ("metering_point_id") REFERENCES "public"."metering_points"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "consumption_point_interval_unique" ON "consumption_data" USING btree ("metering_point_id","interval_start");--> statement-breakpoint
CREATE INDEX "consumption_interval_idx" ON "consumption_data" USING btree ("interval_start");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_number_unique" ON "invoices" USING btree ("number");--> statement-breakpoint
CREATE INDEX "invoices_user_idx" ON "invoices" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "metering_points_eic_unique" ON "metering_points" USING btree ("eic");--> statement-breakpoint
CREATE INDEX "metering_points_user_idx" ON "metering_points" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_unique" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "group_member_unique" ON "sharing_group_members" USING btree ("group_id","metering_point_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");