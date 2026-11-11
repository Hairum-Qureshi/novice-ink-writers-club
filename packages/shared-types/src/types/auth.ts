import type { User } from "./user.js";

type AuthRequest = Request & {
	user: {
		sub: string;
		email: string;
		role: string;
		iat: number;
		exp: number;
	};
};

export type { AuthRequest };
