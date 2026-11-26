import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import useComment from "../../hooks/useComment";
import { useState } from "react";
import { MdCancel } from "react-icons/md";

export default function Comment({
	userId,
	author,
	avatar,
	createdAt,
	content,
	isOwner,
	isAuthor,
	commentId,
	updatedAt
}: {
	userId: string;
	author: string;
	avatar: string;
	createdAt: string;
	content: string;
	isOwner: boolean;
	isAuthor: boolean;
	commentId: string;
	updatedAt: string;
}) {
	const { deleteComment, editComment } = useComment();
	const [editMode, setEditMode] = useState(false);
	const [editedContent, setEditedContent] = useState(content);

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
								{author}{" "}
								{isAuthor && <span className="text-yellow-400">(Author)</span>}
							</h4>
						</Link>
						<time className="text-xs text-green-200/50">
							{new Date(createdAt).toLocaleDateString()}
						</time>
						<span>
							{updatedAt !== createdAt && (
								<span className="text-xs text-green-200/50 ml-2">(Edited)</span>
							)}
						</span>
					</div>
					{isOwner && (
						<div className="flex gap-2">
							{!editMode ? (
								<>
									<button
										className="text-green-200/50 hover:cursor-pointer hover:text-green-200"
										onClick={() => setEditMode(!editMode)}
									>
										<FaEdit />
									</button>
									<button
										className="text-green-200/50 hover:cursor-pointer hover:text-green-200"
										onClick={() => {
											if (
												confirm("Are you sure you want to delete this comment?")
											)
												deleteComment.mutate(commentId);
										}}
									>
										<FaTrash />
									</button>
								</>
							) : (
								<button
									className="text-green-200/50 hover:cursor-pointer hover:text-green-200"
									onClick={() => setEditMode(false)}
								>
									<span className="flex items-center">
										<MdCancel /> <span className="ml-1 text-sm">Cancel</span>
									</span>
								</button>
							)}
						</div>
					)}
				</div>

				{!editMode ? (
					<p className="mt-2 whitespace-pre-wrap wrap-break-word font-alike-angular text-sm leading-relaxed text-green-50/85">
						{content}
					</p>
				) : (
					<div>
						<textarea
							className="mt-2 w-full resize-none rounded-md border border-green-700/50 bg-green-800/20 p-2 font-alike-angular text-sm text-green-50/85"
							value={editedContent}
							onChange={e => setEditedContent(e.target.value)}
						/>
						<button
							className="mt-2 text-green-200/50 hover:cursor-pointer flex ml-auto bg-green-900 px-4 py-1 rounded-md hover:text-green-200 hover:bg-green-600"
							onClick={() => {
								editComment.mutate({ commentId, comment: editedContent });
								setEditMode(false);
							}}
						>
							Save
						</button>
					</div>
				)}
			</div>
		</article>
	);
}
