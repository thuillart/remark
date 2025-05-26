ALTER TABLE "contact" DROP CONSTRAINT "contact_reference_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "vote" DROP CONSTRAINT "vote_reference_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_reference_id_user_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_reference_id_user_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;