const Grade = {
	FRESHMAN: "freshman",
	SOPHOMORE: "sophomore",
	JUNIOR: "junior",
	SENIOR: "senior",
	PREFER_NOT_TO_SAY: "prefer not to say"
} as const;

type Grade = (typeof Grade)[keyof typeof Grade];

export { Grade };
