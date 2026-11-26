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
		mutate: (variables: FormData) => void;
	};
	updateUserBackdrop: {
		data: SafeUser | undefined;
		isPending: boolean;
		isError: boolean;
		error: unknown;
		mutate: (variables: FormData) => void;
	};
	deleteAccount: {
		isPending: boolean;
		isError: boolean;
		error: unknown;
		mutate: (
			variables?: void,
			options?: { onSuccess?: () => void }
		) => void;
	};
}

export type { UseUserHook };
