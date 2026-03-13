CREATE TYPE "public"."app_role" AS ENUM('user', 'collector', 'staff', 'super_admin');--> statement-breakpoint
CREATE TYPE "public"."attachment_kind" AS ENUM('pickup_proof', 'support_attachment', 'dispute_attachment', 'avatar');--> statement-breakpoint
CREATE TYPE "public"."collector_availability" AS ENUM('offline', 'available', 'busy');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('system', 'pickup_update', 'verification', 'reward', 'support');--> statement-breakpoint
CREATE TYPE "public"."pickup_request_status" AS ENUM('draft', 'requested', 'assigned', 'accepted', 'en_route', 'collected', 'verified', 'rejected', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."points_direction" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "public"."redemption_status" AS ENUM('pending', 'approved', 'rejected', 'fulfilled');--> statement-breakpoint
CREATE TYPE "public"."reward_type" AS ENUM('cashout', 'voucher', 'partner_reward');--> statement-breakpoint
CREATE TYPE "public"."support_status" AS ENUM('open', 'in_review', 'escalated', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."waste_type" AS ENUM('plastic', 'paper', 'glass', 'metal', 'electronic', 'textile', 'organic', 'mixed');--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_profile_id" uuid,
	"pickup_request_id" uuid,
	"pickup_item_id" uuid,
	"support_ticket_id" uuid,
	"dispute_id" uuid,
	"kind" "attachment_kind" NOT NULL,
	"file_key" text NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text,
	"mime_type" text,
	"file_size" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_profile_id" uuid,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"action" text NOT NULL,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collector_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"availability" "collector_availability" DEFAULT 'offline' NOT NULL,
	"vehicle_type" text,
	"coverage_radius_km" numeric(6, 2) DEFAULT '10.00' NOT NULL,
	"current_latitude" numeric(10, 8),
	"current_longitude" numeric(11, 8),
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_profile_id" uuid NOT NULL,
	"pickup_request_id" uuid,
	"support_ticket_id" uuid,
	"status" "support_status" DEFAULT 'open' NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"resolution" text,
	"assigned_to_profile_id" uuid,
	"escalated_to_profile_id" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"type" "notification_type" DEFAULT 'system' NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"data" jsonb,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pickup_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pickup_request_id" uuid NOT NULL,
	"waste_type" "waste_type" NOT NULL,
	"quantity" integer,
	"estimated_weight_kg" numeric(8, 2),
	"actual_weight_kg" numeric(8, 2),
	"notes" text,
	"verification_status" "verification_status" DEFAULT 'pending' NOT NULL,
	"points_awarded" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pickup_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_profile_id" uuid NOT NULL,
	"assigned_collector_profile_id" uuid,
	"status" "pickup_request_status" DEFAULT 'requested' NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"city" text DEFAULT 'Lagos' NOT NULL,
	"state" text DEFAULT 'Lagos' NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"pickup_window_label" text,
	"scheduled_for" timestamp with time zone,
	"estimated_weight_kg" numeric(8, 2),
	"notes" text,
	"assigned_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"collected_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "points_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"pickup_request_id" uuid,
	"pickup_item_id" uuid,
	"redemption_request_id" uuid,
	"direction" "points_direction" NOT NULL,
	"points" integer NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text,
	"full_name" text,
	"phone_number" text,
	"avatar_url" text,
	"role" "app_role" DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"city" text DEFAULT 'Lagos',
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "redemption_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_profile_id" uuid NOT NULL,
	"reward_id" uuid,
	"status" "redemption_status" DEFAULT 'pending' NOT NULL,
	"points_spent" integer NOT NULL,
	"payout_method" text,
	"payout_destination" jsonb,
	"notes" text,
	"rejection_reason" text,
	"reviewed_by_profile_id" uuid,
	"reviewed_at" timestamp with time zone,
	"fulfilled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "reward_type" NOT NULL,
	"points_cost" integer NOT NULL,
	"cash_value_minor" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"stock" integer,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_profile_id" uuid NOT NULL,
	"pickup_request_id" uuid,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" "support_status" DEFAULT 'open' NOT NULL,
	"priority" "ticket_priority" DEFAULT 'medium' NOT NULL,
	"assigned_to_profile_id" uuid,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pickup_request_id" uuid NOT NULL,
	"pickup_item_id" uuid,
	"reviewer_profile_id" uuid NOT NULL,
	"status" "verification_status" NOT NULL,
	"reason" text,
	"verified_points" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_owner_profile_id_profiles_id_fk" FOREIGN KEY ("owner_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_pickup_request_id_pickup_requests_id_fk" FOREIGN KEY ("pickup_request_id") REFERENCES "public"."pickup_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_pickup_item_id_pickup_items_id_fk" FOREIGN KEY ("pickup_item_id") REFERENCES "public"."pickup_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_support_ticket_id_support_tickets_id_fk" FOREIGN KEY ("support_ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_dispute_id_disputes_id_fk" FOREIGN KEY ("dispute_id") REFERENCES "public"."disputes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_profile_id_profiles_id_fk" FOREIGN KEY ("actor_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collector_profiles" ADD CONSTRAINT "collector_profiles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_requester_profile_id_profiles_id_fk" FOREIGN KEY ("requester_profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_pickup_request_id_pickup_requests_id_fk" FOREIGN KEY ("pickup_request_id") REFERENCES "public"."pickup_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_support_ticket_id_support_tickets_id_fk" FOREIGN KEY ("support_ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_assigned_to_profile_id_profiles_id_fk" FOREIGN KEY ("assigned_to_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_escalated_to_profile_id_profiles_id_fk" FOREIGN KEY ("escalated_to_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_items" ADD CONSTRAINT "pickup_items_pickup_request_id_pickup_requests_id_fk" FOREIGN KEY ("pickup_request_id") REFERENCES "public"."pickup_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_requester_profile_id_profiles_id_fk" FOREIGN KEY ("requester_profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_assigned_collector_profile_id_collector_profiles_id_fk" FOREIGN KEY ("assigned_collector_profile_id") REFERENCES "public"."collector_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_ledger" ADD CONSTRAINT "points_ledger_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_ledger" ADD CONSTRAINT "points_ledger_pickup_request_id_pickup_requests_id_fk" FOREIGN KEY ("pickup_request_id") REFERENCES "public"."pickup_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_ledger" ADD CONSTRAINT "points_ledger_pickup_item_id_pickup_items_id_fk" FOREIGN KEY ("pickup_item_id") REFERENCES "public"."pickup_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_ledger" ADD CONSTRAINT "points_ledger_redemption_request_id_redemption_requests_id_fk" FOREIGN KEY ("redemption_request_id") REFERENCES "public"."redemption_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_requests" ADD CONSTRAINT "redemption_requests_requester_profile_id_profiles_id_fk" FOREIGN KEY ("requester_profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_requests" ADD CONSTRAINT "redemption_requests_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_requests" ADD CONSTRAINT "redemption_requests_reviewed_by_profile_id_profiles_id_fk" FOREIGN KEY ("reviewed_by_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_requester_profile_id_profiles_id_fk" FOREIGN KEY ("requester_profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_pickup_request_id_pickup_requests_id_fk" FOREIGN KEY ("pickup_request_id") REFERENCES "public"."pickup_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_profile_id_profiles_id_fk" FOREIGN KEY ("assigned_to_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_pickup_request_id_pickup_requests_id_fk" FOREIGN KEY ("pickup_request_id") REFERENCES "public"."pickup_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_pickup_item_id_pickup_items_id_fk" FOREIGN KEY ("pickup_item_id") REFERENCES "public"."pickup_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_reviewer_profile_id_profiles_id_fk" FOREIGN KEY ("reviewer_profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attachments_file_key_idx" ON "attachments" USING btree ("file_key");--> statement-breakpoint
CREATE INDEX "attachments_kind_idx" ON "attachments" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "collector_profiles_profile_id_idx" ON "collector_profiles" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "collector_profiles_availability_idx" ON "collector_profiles" USING btree ("availability");--> statement-breakpoint
CREATE INDEX "disputes_status_idx" ON "disputes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "disputes_requester_idx" ON "disputes" USING btree ("requester_profile_id");--> statement-breakpoint
CREATE INDEX "notifications_profile_idx" ON "notifications" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "notifications_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "pickup_items_request_idx" ON "pickup_items" USING btree ("pickup_request_id");--> statement-breakpoint
CREATE INDEX "pickup_items_type_idx" ON "pickup_items" USING btree ("waste_type");--> statement-breakpoint
CREATE INDEX "pickup_requests_status_idx" ON "pickup_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pickup_requests_requester_idx" ON "pickup_requests" USING btree ("requester_profile_id");--> statement-breakpoint
CREATE INDEX "pickup_requests_collector_idx" ON "pickup_requests" USING btree ("assigned_collector_profile_id");--> statement-breakpoint
CREATE INDEX "points_ledger_profile_idx" ON "points_ledger" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "points_ledger_request_idx" ON "points_ledger" USING btree ("pickup_request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_clerk_user_id_idx" ON "profiles" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_email_idx" ON "profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "redemption_requests_requester_idx" ON "redemption_requests" USING btree ("requester_profile_id");--> statement-breakpoint
CREATE INDEX "redemption_requests_status_idx" ON "redemption_requests" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "rewards_slug_idx" ON "rewards" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "rewards_active_idx" ON "rewards" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "support_tickets_status_idx" ON "support_tickets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "support_tickets_requester_idx" ON "support_tickets" USING btree ("requester_profile_id");--> statement-breakpoint
CREATE INDEX "verification_records_request_idx" ON "verification_records" USING btree ("pickup_request_id");--> statement-breakpoint
CREATE INDEX "verification_records_status_idx" ON "verification_records" USING btree ("status");