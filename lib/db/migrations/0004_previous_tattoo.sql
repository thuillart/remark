ALTER TABLE "vote" ADD COLUMN "browsers" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vote" ADD COLUMN "operating_systems" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vote" ADD COLUMN "devices" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vote" ADD COLUMN "tags" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vote" ADD COLUMN "impact" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vote" DROP COLUMN "archived";