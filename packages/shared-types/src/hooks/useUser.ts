import type { User } from "../types/user.js";

export type SafeUser = Omit<User, "password">;

interface UseUserHook {
	getAllUsers: {
		mutate: (
			variables: void,
			options?: { onSuccess?: (data: SafeUser[]) => void }
		) => void;
		data: Omit<SafeUser, "password">[] | undefined;
		isPending: boolean;
		error: unknown;
		isError: boolean;
	};
}

export type { UseUserHook };
