import type { PublishedGenre } from "../types/publishedGenre.js";

interface UseGenreHook {
	getAllPublishedStories: {
		data: PublishedGenre[] | undefined;
		isPending: boolean;
		isError: boolean;
		error: unknown;
	};
}

export type { UseGenreHook };
