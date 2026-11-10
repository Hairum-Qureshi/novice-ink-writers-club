type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePicture: string;
	password: string;
	isVerified: boolean;
	verificationCode: string | null;
	verificationCodeExpiry: Date | null;
};

export type { User };
