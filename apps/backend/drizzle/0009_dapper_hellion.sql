DROP INDEX "unique_user";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user" ON "users" USING btree ("email","verification_code");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "reset_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "reset_token_expiry";