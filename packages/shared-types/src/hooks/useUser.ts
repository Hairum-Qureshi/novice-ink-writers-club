import type { User } from "../types/user.js";

export type SafeUser = Omit<User, "password">;

interface UseUserHook {
	getAllUsers: {
		data: SafeUser[] | undefined;
		isPending: boolean;
		isError: boolean;
		error: unknown;
	};
	getUserById: {
		data: SafeUser | undefined;
		isPending: boolean;
		isError: boolean;
		error: unknown;
	};
	updateUserPfp: {
		data: SafeUser | undefined;
		isPending: boolean;
		isError: boolean;
		error: unknown;
		onSuccess: (callback: () => void) => void;
	};
	updateUserBackdrop: {
		data: SafeUser | undefined;
		isPending: boolean;
		isError: boolean;
		error: unknown;
		onSuccess: (callback: () => void) => void;
	};
}

export type { UseUserHook };
