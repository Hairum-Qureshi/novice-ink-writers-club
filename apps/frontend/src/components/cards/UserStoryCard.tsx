import type { Genre } from "@repo/shared-types";
import { FiBookOpen } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";

export default function UserStoryCard({
	key,
	title,
	genre
}: {
	key: number;
	title: string;
	genre: Genre;
}) {
	return (
		<div
			key={key}
			className="mb-4 flex items-center gap-4 border-y-2 border-[#d6dcd5] py-3 hover:bg-gray-100"
		>
			<FiBookOpen className="text-3xl text-gray-400 border-r-2 border-[#d6dcd5] pr-2 h-10" />
			<div>
				<h3 className="text-base font-semibold text-gray-600 font-alike-angular">
					{title}
				</h3>
				<p className="text-sm text-gray-500 font-alike-angular">
					<strong>Genre:</strong> {genre}
				</p>
			</div>
			<MdArrowOutward className="text-xl text-gray-400 ml-auto" />
		</div>
	);
}
