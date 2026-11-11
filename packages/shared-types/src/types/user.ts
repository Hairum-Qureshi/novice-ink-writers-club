import type { Role } from "../enums/role.js";

type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePicture: string;
	password: string;
	role: Role;
	isVerified: boolean;
	verificationCode: string | null;
	verificationCodeExpiry: Date | null;
};

export type { User };
