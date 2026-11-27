import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { UseCommentHook } from "@repo/shared-types";

export default function useComment(): UseCommentHook {
	const { storyId } = useParams<{ storyId: string }>();
	const queryClient = useQueryClient();

	const getComments = useQuery({
		queryKey: ["comments", storyId],
		enabled: !!storyId,
		queryFn: async () => {
			if (!storyId) throw new Error("A story ID is required to fetch comments");
			const { data } = await api.get<Comment[]>(`/api/comments/${storyId}/all`);
			return data;
		}
	});

	const createComment = useMutation({
		mutationFn: async (comment: string) => {
			if (!storyId)
				throw new Error("A story ID is required to create a comment");
			if (!comment.trim()) throw new Error("Comment cannot be empty");
			if (comment.length > 500)
				throw new Error("Comment cannot exceed 500 characters");

			await api.post(`/api/comments/${storyId}/new`, {
				comment
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
		}
	});

	const editComment = useMutation({
		mutationFn: async ({
			commentId,
			comment
		}: {
			commentId: string;
			comment: string;
		}) => {
			if (!comment.trim()) throw new Error("Comment cannot be empty");
			if (comment.length > 500)
				throw new Error("Comment cannot exceed 500 characters");

			const { data } = await api.patch<Comment[]>(
				`/api/comments/${commentId}/edit`,
				{ comment }
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
		}
	});

	const deleteComment = useMutation({
		mutationFn: async (commentId: string) => {
			const { data } = await api.delete<Comment[]>(
				`/api/comments/${commentId}/delete`
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
		}
	});

	return { getComments, createComment, editComment, deleteComment };
}
