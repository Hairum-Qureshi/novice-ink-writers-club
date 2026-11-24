ALTER TABLE "stories" ALTER COLUMN "genre" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."genres";--> statement-breakpoint
CREATE TYPE "public"."genres" AS ENUM('apocalyptic', 'dystopian', 'poetry', 'essays', 'sci-fi', 'fantasy', 'mystery');--> statement-breakpoint
ALTER TABLE "stories" ALTER COLUMN "genre" SET DATA TYPE "public"."genres" USING "genre"::"public"."genres";