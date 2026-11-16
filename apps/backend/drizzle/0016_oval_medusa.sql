ALTER TYPE "public"."grades" ADD VALUE 'prefer not to say';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'prefer not to say';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "grade" SET DEFAULT 'prefer not to say';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "grade" SET NOT NULL;