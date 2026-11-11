CREATE TYPE "public"."genders" AS ENUM('male', 'female', 'prefer not to say');--> statement-breakpoint
CREATE TYPE "public"."grades" AS ENUM('freshman', 'sophomore', 'junior', 'senior');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" "genders";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "grade" "grades";