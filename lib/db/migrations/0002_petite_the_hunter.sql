ALTER TABLE "vote" ALTER COLUMN "status" SET DEFAULT 'open';--> statement-breakpoint
ALTER TABLE "vote" ADD COLUMN "feedback_ids" text[] NOT NULL;