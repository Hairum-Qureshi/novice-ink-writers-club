import { Genre } from "../enums/genres.js";

export type PublishedGenre = {
	id: string;
	title: string;
	description: string;
	genre: Genre;
	authorId: string | null;
	authorName: string;
	createdAt: string;
	updatedAt: string;
};
