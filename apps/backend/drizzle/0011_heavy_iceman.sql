ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "biography" text DEFAULT 'This user prefers to keep an air of mystery about them' NOT NULL;