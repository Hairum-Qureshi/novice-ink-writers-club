import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseUserHook } from "@repo/shared-types";
import { api } from "../lib/api";
import type { SafeUser } from "@repo/shared-types";
import { useParams } from "react-router-dom";

export default function useUser(): UseUserHook {
	const { userId } = useParams();
	const queryClient = useQueryClient();

	const updateUserPfp = useMutation({
		mutationFn: async (formData: FormData) => {
			const { data } = await api.patch<SafeUser>(
				"/api/users/update-pfp",
				formData
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user", userId] });
		}
	});

	const updateUserBackdrop = useMutation({
		mutationFn: async (formData: FormData) => {
			const { data } = await api.patch<SafeUser>(
				"/api/users/update-backdrop",
				formData
			);
			return data;
		},
		onSuccess: () => {
			console.log("Triggered");
			queryClient.invalidateQueries({ queryKey: ["user", userId] });
		}
	});

	const getAllUsers = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const { data } = await api.get<SafeUser[]>("/api/users/all");
			return data;
		}
	});

	const getUserById = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			if (!userId) return;

			const { data } = await api.get<SafeUser>(`/api/users/${userId}`);
			return data;
		}
	});

	return {
		getAllUsers,
		getUserById,
		updateUserPfp,
		updateUserBackdrop
	};
}
