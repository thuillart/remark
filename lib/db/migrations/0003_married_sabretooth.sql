ALTER TABLE "vote" RENAME COLUMN "subject" TO "title";--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "vote" ADD COLUMN "description" text NOT NULL;