import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Comment({
	userId,
	author,
	avatar,
	createdAt,
	content,
	isOwner,
	isAuthor
}: {
	userId: string;
	author: string;
	avatar: string;
	createdAt: string;
	content: string;
	isOwner: boolean;
	isAuthor: boolean;
}) {
	return (
		<article className="flex items-start gap-3 rounded-xl border border-green-700/30 bg-green-800/20 p-4">
			<img
				src={avatar}
				alt={author}
				className="size-10 shrink-0 rounded-full object-cover"
			/>
			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-2">
					<div>
						<Link to={`/user/${userId}/profile`}>
							<h4 className="text-sm underline hover:cursor-pointer hover:text-green-300 font-semibold text-white">
								{author} {isAuthor && <span className="text-yellow-400">(Author)</span>}
							</h4>
						</Link>
						<time className="text-xs text-green-200/50">
							{new Date(createdAt).toLocaleDateString()}
						</time>
					</div>
					{isOwner && (
						<div className="flex gap-2">
							<button className="text-green-200/50 hover:cursor-pointer hover:text-green-200">
								<FaEdit />
							</button>
							<button className="text-green-200/50 hover:cursor-pointer hover:text-green-200">
								<FaTrash />
							</button>
						</div>
					)}
				</div>

				{/* Comment body */}
				<p className="mt-2 whitespace-pre-wrap wrap-break-word font-alike-angular text-sm leading-relaxed text-green-50/85">
					{content}
				</p>
			</div>
		</article>
	);
}
