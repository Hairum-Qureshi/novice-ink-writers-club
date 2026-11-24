import { Navigate, useParams } from "react-router-dom";
import type { Genre as GenreEnum } from "@repo/shared-types";
import StoryCard from "../components/StoryCard";
import useGenre from "../hooks/useGenre";

export default function Genre() {
	const { genre } = useParams();
	const { getAllPublishedStories } = useGenre();

	console.log(getAllPublishedStories.data);

	if (
		!genre ||
		![
			"apocalyptic",
			"poetry",
			"essays",
			"dystopian",
			"mystery",
			"sci-fi",
			"fantasy"
		].includes(genre)
	)
		return <Navigate to="/" />;

	return (
		<main className="min-h-[calc(100vh-5rem)] bg-[#0d1a10] px-4 py-8 text-white">
			<div className="mx-auto max-w-6xl space-y-10">
				{/* Genre introduction */}
				<section className="flex min-h-64 items-end rounded-lg border border-green-800/70 bg-[#0f200f] p-8 md:p-10">
					<div className="max-w-2xl space-y-3">
						<h1 className="font-alike-angular text-4xl font-semibold text-white/90 md:text-5xl">
							{genre?.replace(/^\w/, c => c.toUpperCase())}
						</h1>

						<p className="font-alike-angular leading-relaxed text-white/70">
							Read through published{" "}
							{genre === "essays"
								? "essays"
								: genre === "poetry"
									? "poetry"
									: "stories"}{" "}
							that students from Christiana High School have contributed to the
							Novice Ink. Writer's Club website.
						</p>
					</div>
				</section>

				{/* Stories */}
				<section className="space-y-6 mb-5">
					<div className="flex items-end justify-between border-b border-green-800/50 pb-4">
						<div className="space-y-1">
							<h2 className="font-alike-angular text-2xl font-semibold">
								Published{" "}
								{genre === "essays"
									? "Essays"
									: genre === "poetry"
										? "Poetry"
										: "Stories"}
							</h2>
						</div>

						<span className="text-sm text-white/50 font-alike-angular">
							{getAllPublishedStories.data?.length ?? 0} stories
						</span>
					</div>

					{getAllPublishedStories.data?.length ? (
						getAllPublishedStories.data?.map(story => (
							<StoryCard
								key={story.id}
								authorName={story.authorName}
								title={story.title}
								storyId={story.id}
								description={story.description}
								datePosted={new Date(story.createdAt).toLocaleDateString()}
								genre={genre as GenreEnum}
							/>
						))
					) : (
						<p className="text-white/50 text-center py-4 text-lg font-alike-angular">
							Nothing was published for this genre.
						</p>
					)}
				</section>
			</div>
		</main>
	);
}
