import type { User } from "../types/user.js";

export type SafeUser = Omit<User, "password">;

interface UseUserHook {
	getAllUsers: {
		data: SafeUser[] | undefined;
		isPending: boolean;
		isError: boolean;
		error: unknown;
	};
}

export type { UseUserHook };
