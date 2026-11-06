import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseAuthHook } from "@repo/shared-types";

export default function useAuth(): UseAuthHook {
	const queryClient = useQueryClient();

	const signOutMutation = useMutation({
		mutationFn: async () => {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-out`,
				{},
				{
					withCredentials: true
				}
			);
		},
		onSuccess: () => {
			queryClient.setQueryData(["currentUser"], null);
		}
	});

	return {
		signOut: signOutMutation.mutateAsync
	};
}
