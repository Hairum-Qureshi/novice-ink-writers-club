const Gender = {
	MALE: "male",
	FEMALE: "female",
	PREFER_NOT_TO_SAY: "prefer not to say"
} as const;

type Gender = (typeof Gender)[keyof typeof Gender];

export { Gender };
