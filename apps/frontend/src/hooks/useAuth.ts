import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	UseAuthHook,
	SignUpFormData,
	SignInFormData
} from "@repo/shared-types";

export default function useAuth(): UseAuthHook {
	const queryClient = useQueryClient();

	const signUpMutation = useMutation({
		mutationFn: async (formData: SignUpFormData) => {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-up`,
				formData,
				{
					withCredentials: true
				}
			);
		}
	});

	const signInMutation = useMutation({
		mutationFn: async (formData: SignInFormData) => {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-in`,
				formData,
				{
					withCredentials: true
				}
			);
		}
	});

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
		signOut: signOutMutation.mutateAsync,
		signUp: signUpMutation.mutateAsync,
		signIn: signInMutation.mutateAsync
	};
}
