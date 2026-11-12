import { useMutation } from "@tanstack/react-query";
import type { UseUserHook } from "@repo/shared-types";
import { api } from "../lib/api";
import type { SafeUser } from "@repo/shared-types";

export default function useUser(): UseUserHook {
	const getAllUsersMutation = useMutation({
		mutationFn: async () => {
			const { data } = await api.get<SafeUser[]>("/api/users/all");
			return data;
		}
	});

	return {
		getAllUsers: getAllUsersMutation
	};
}
