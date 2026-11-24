ALTER TABLE "comments" ALTER COLUMN "author_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stories" ALTER COLUMN "author_id" DROP NOT NULL;