CREATE TABLE "vote" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"count" integer NOT NULL,
	"reference_id" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "embedding" text;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_reference_id_user_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;