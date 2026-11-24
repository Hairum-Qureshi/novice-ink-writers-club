import type { Genre, PublishedGenre, UseGenreHook } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function useGenre(): UseGenreHook {
	const { genre, storyId, userId } = useParams<{
		genre: Genre;
		storyId: string;
		userId: string;
	}>();

	const getAllPublishedStories = useQuery({
		queryKey: ["published", genre],
		queryFn: async () => {
			if (!genre) return;
			const { data } = await api.get<PublishedGenre[]>(
				`/api/genres/${genre}/published/all`
			);
			return data;
		}
	});

	const getPublishedStoryContent = useQuery({
		queryKey: ["content", storyId],
		queryFn: async () => {
			if (!genre || !storyId) return;
			const { data } = await api.get<{
				content: string;
				title: string;
				authorName: string;
				createdAt: string;
			}>(`/api/genres/${storyId}/content`);
			return data;
		}
	});

	const getAllPublishedUserContent = useQuery({
		queryKey: ["publishedUserContent", userId],
		queryFn: async () => {
			if (!userId) return;
			const { data } = await api.get<
				{ id: string; title: string; genre: Genre }[]
			>(`/api/genres/published/${userId}/all`);
			return data;
		}
	});

	return {
		getAllPublishedStories,
		getPublishedStoryContent,
		getAllPublishedUserContent
	};
}
