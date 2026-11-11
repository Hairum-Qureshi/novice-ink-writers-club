DROP INDEX "unique_user";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_token_expiry" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user" ON "users" USING btree ("email","verification_code","reset_token");