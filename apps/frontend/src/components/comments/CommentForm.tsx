import useComment from "../../hooks/useComment";
import { useState } from "react";

export default function CommentForm() {
	const { createComment } = useComment();
	const [comment, setComment] = useState("");

	return (
		<form
			className="w-full"
			onSubmit={e => {
				e.preventDefault();
				createComment.mutate(comment);
				setComment("");
			}}
		>
			<div className="overflow-hidden rounded-xl border border-green-700/50 bg-green-800/30 transition-colors focus-within:border-green-500/70">
				<textarea
					className="block w-full min-h-18 max-h-30 resize-y bg-transparent p-4 text-white font-alike-angular outline-none placeholder:text-green-200/40"
					placeholder="Write a comment..."
					aria-label="Write a comment"
					required
					value={comment}
					onChange={e => setComment(e.target.value)}
				/>

				<div className="flex items-center justify-between gap-3 border-t border-green-700/30 bg-green-950/20 px-4 py-3">
					<span className="text-xs text-green-200/50 font-alike-angular">
						Share your thoughts.
					</span>

					<button
						type="submit"
						className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 active:bg-green-700"
					>
						Post comment
					</button>
				</div>
			</div>
		</form>
	);
}
