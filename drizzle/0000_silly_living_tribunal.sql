CREATE TYPE "public"."experience_kind" AS ENUM('work', 'freelance', 'education', 'milestone');--> statement-breakpoint
CREATE TYPE "public"."project_filter" AS ENUM('full-stack', 'frontend', 'game', 'web3', 'systems');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('live', 'in-progress', 'planned', 'completed');--> statement-breakpoint
CREATE TABLE "experience_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"kind" "experience_kind" NOT NULL,
	"title" text NOT NULL,
	"organization" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"summary" text NOT NULL,
	"summary_short" text,
	"bullets" text[] DEFAULT '{}'::text[] NOT NULL,
	"shipped" jsonb,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "experience_items_slug_unique" UNIQUE("slug"),
	CONSTRAINT "experience_start_format" CHECK ("experience_items"."start_date" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
	CONSTRAINT "experience_end_format" CHECK ("experience_items"."end_date" is null or "experience_items"."end_date" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$')
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"handle" text NOT NULL,
	"role_label" text NOT NULL,
	"headline" text NOT NULL,
	"intro" text NOT NULL,
	"contact_headline" text NOT NULL,
	"contact_intro" text NOT NULL,
	"location_label" text NOT NULL,
	"timezone" text NOT NULL,
	"availability" text NOT NULL,
	"availability_short" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"portrait_url" text,
	"resume_url" text,
	"socials" jsonb NOT NULL,
	"chips" text[] NOT NULL,
	"focus_areas" text[] NOT NULL,
	"seo_title" text NOT NULL,
	"seo_description" text NOT NULL,
	CONSTRAINT "profile_singleton" CHECK ("profile"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"kicker" text NOT NULL,
	"summary" text NOT NULL,
	"filter_type" "project_filter" NOT NULL,
	"status" "project_status" NOT NULL,
	"logo_url" text,
	"tech" text[] DEFAULT '{}'::text[] NOT NULL,
	"links" jsonb NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "skill_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"index_label" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"badge" text NOT NULL,
	"icon_key" text NOT NULL,
	"items" jsonb NOT NULL,
	"highlights" text[] DEFAULT '{}'::text[] NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "skill_groups_slug_unique" UNIQUE("slug")
);
