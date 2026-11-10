ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
CREATE TYPE "public"."roles_new" AS ENUM('admin', 'president', 'vice president', 'secretary', 'magazine selector', 'member');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."roles_new" USING (
  CASE "role"::text
    WHEN 'user' THEN 'member'
    ELSE "role"::text
  END
)::"public"."roles_new";--> statement-breakpoint
DROP TYPE "public"."roles";--> statement-breakpoint
ALTER TYPE "public"."roles_new" RENAME TO "roles";--> statement-breakpoint
UPDATE "users" SET "role" = 'member' WHERE "role" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
