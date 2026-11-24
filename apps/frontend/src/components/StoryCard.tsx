import { MdArrowOutward } from "react-icons/md";

export default function StoryCard({
	authorName,
	title,
	storyId,
	description,
	datePosted
}: {
	authorName: string;
	title: string;
	storyId: string;
	description: string;
	datePosted: string;
}) {
	return (
		<article className="group border-b border-green-800/60 px-2 py-8">
			<div className="space-y-3">
				<p className="text-xs tracking-widest text-green-300/60">
					{/* You can replace this with a dynamic date if available */}
					{datePosted}
				</p>

				<h3 className="font-alike-angular text-2xl text-white/90 transition-colors group-hover:text-green-200 md:text-3xl">
					{title}
				</h3>

				<p className="max-w-3xl font-alike-angular text-sm leading-relaxed text-white/65">
					{description}
				</p>

				<div className="flex items-center justify-between pt-3">
					<span className="text-sm text-white/50 font-alike-angular">
						By {authorName}
					</span>

					<a
						href={`/stories/${storyId}`}
						className="text-sm text-green-200 transition-colors hover:text-white"
					>
						Read story <MdArrowOutward className="inline-block ml-1" />
					</a>
				</div>
			</div>
		</article>
	);
}
