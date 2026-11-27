import type { Genre } from "../enums/genres.js";
import type { PublishedGenre } from "../types/publishedGenre.js";
interface UseGenreHook {
    getAllPublishedStories: {
        data: PublishedGenre[] | undefined;
        isPending: boolean;
        isError: boolean;
        error: unknown;
    };
    getPublishedStoryContent: {
        data: {
            content: string;
            authorName: string;
            createdAt: string;
            title: string;
            author: {
                id: string;
            };
        } | undefined;
        isPending: boolean;
        isError: boolean;
        error: unknown;
    };
    getAllPublishedUserContent: {
        data: {
            id: string;
            title: string;
            genre: Genre;
        }[] | undefined;
        isPending: boolean;
        isError: boolean;
        error: unknown;
    };
}
export type { UseGenreHook };
