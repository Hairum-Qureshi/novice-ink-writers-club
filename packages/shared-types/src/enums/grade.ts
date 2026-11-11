const Grade = {
	FRESHMAN: "freshman",
	SOPHOMORE: "sophomore",
	JUNIOR: "junior",
	SENIOR: "senior"
} as const;

type Grade = (typeof Grade)[keyof typeof Grade];

export { Grade };
