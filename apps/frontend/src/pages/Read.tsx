import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import useGenre from "../hooks/useGenre";
import CommentForm from "../components/comments/CommentForm";
import Comment from "../components/comments/Comment";
import useComment from "../hooks/useComment";
import type { Comment as CommentType } from "@repo/shared-types";
import { useAuthStore } from "../stores/auth.store";
import NotFound from "./NotFound";

export default function Read() {
	const navigate = useNavigate();
	const { getPublishedStoryContent } = useGenre();
	const { getComments } = useComment();
	const comments = getComments?.data ?? [];
	const currUser = useAuthStore(state => state.user);

	if (!getPublishedStoryContent?.data) return <NotFound />;

	return (
		<main className="min-h-[calc(100vh-5rem)] bg-[#0d1a10] px-5 py-10 text-white">
			<div className="mx-auto max-w-6xl">
				<button
					onClick={() => navigate(-1)}
					className="text-sm hover:cursor-pointer text-green-200/70 transition-colors hover:text-green-200"
				>
					<FaArrowLeftLong className="inline-block mr-2" />
					Back to Genre
				</button>
				<header className="mx-auto max-w-3xl pb-12 pt-16 text-center">
					<h1 className="font-alike-angular text-4xl text-white/95">
						{getPublishedStoryContent?.data?.title}
					</h1>

					<div className="mt-6 space-y-2">
						<p className="text-base font-alike-angular text-white/75">
							Written by {getPublishedStoryContent?.data?.authorName}
						</p>

						<p className="text-sm text-white/45 font-alike-angular">
							{new Date(
								getPublishedStoryContent?.data?.createdAt ?? ""
							).toLocaleDateString(undefined, {
								year: "numeric",
								month: "long",
								day: "numeric"
							})}
						</p>
					</div>
				</header>
				<article className="mx-auto w-3/4 border-t border-green-800/60 pt-12">
					<div className="space-y-6 font-serif text-lg leading-[1.9] text-white/85">
						<div
							dangerouslySetInnerHTML={{
								__html: getPublishedStoryContent?.data?.content || ""
							}}
						/>
					</div>
					<div className="border-t border-green-800/60 w-full mt-10">
						<h2 className="font-alike-angular my-5 text-2xl text-white/95">
							Comments ({comments.length})
						</h2>
						<CommentForm />
						<div className="space-y-4 my-10">
							{comments.length ? (
								comments?.map((comment: CommentType) => (
									<Comment
										key={comment.id}
										userId={comment.author.id as unknown as string}
										author={`${comment.author.firstName} ${comment.author.lastName}`}
										avatar={comment.author.profilePicture as unknown as string}
										createdAt={comment.createdAt}
										content={comment.content}
										isOwner={
											currUser?.id === (comment.author.id as unknown as string)
										}
										isAuthor={
											(comment.author.id as unknown as string) ===
											(getPublishedStoryContent?.data?.author.id as unknown as string)
										}
										commentId={comment.id}
										updatedAt={comment.updatedAt}
									/>
								))
							) : (
								<p className="text-white/75 text-center">No comments yet.</p>
							)}
						</div>
					</div>
				</article>
			</div>
		</main>
	);
}
