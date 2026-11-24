import type { Genre, PublishedGenre, UseGenreHook } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function useGenre(): UseGenreHook {
	const { genre, storyId } = useParams<{
		genre: Genre;
		storyId: string;
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
			}>(`/api/genres/${storyId}/content`);
			return data;
		}
	});
	return { getAllPublishedStories, getPublishedStoryContent };
}
