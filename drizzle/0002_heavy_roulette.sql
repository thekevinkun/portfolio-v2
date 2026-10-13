CREATE TABLE "project_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"label" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "project_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
INSERT INTO "project_categories" ("slug", "label", "sort") VALUES
	('full-stack', 'Full Stack', 0),
	('frontend', 'Frontend', 1),
	('game', 'Game', 2),
	('web3', 'Web3', 3),
	('systems', 'C/C++', 4)
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "filter_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_filter_type_project_categories_slug_fk" FOREIGN KEY ("filter_type") REFERENCES "public"."project_categories"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."project_filter";