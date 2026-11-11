DROP INDEX "unique_user";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "verification_code";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "verification_code_expiry";