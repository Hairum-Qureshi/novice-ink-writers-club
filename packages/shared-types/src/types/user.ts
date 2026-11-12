import { Grade } from "../enums/grade.js";
import type { Role } from "../enums/role.js";
import type { Gender } from "../enums/gender.js";

type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePicture: string;
	biography: string;
	password: string;
	role: Role;
	grade: Grade | null;
	gender: Gender | null;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type { User };
