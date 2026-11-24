const Genre = {
	ESSAYS: "essays",
	POETRY: "poetry",
	APOCALYPTIC: "apocalyptic",
	DYSTOPIAN: "dystopian",
	MYSTERY: "mystery",
	SCI_FI: "sci-fi",
	FANTASY: "fantasy"
} as const;

type Genre = (typeof Genre)[keyof typeof Genre];

export { Genre };
