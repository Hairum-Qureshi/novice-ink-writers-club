import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SafeUser, UserSettingsFormData } from "@repo/shared-types";
import { api } from "../lib/api";
import { useParams } from "react-router-dom";

export default function useUser() {
	const { userId } = useParams();
	const queryClient = useQueryClient();

	const updateUser = useMutation({
		mutationFn: async (settings: UserSettingsFormData) => {
			const { data } = await api.patch<SafeUser>(
				"/api/users/update-user",
				settings
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user", userId] });
		}
	});

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
			queryClient.invalidateQueries({ queryKey: ["users"] });
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
		updateUser,
		updateUserPfp,
		updateUserBackdrop
	};
}
