import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type {
	UseAuthHook,
	SignUpFormData,
	SignInFormData
} from "@repo/shared-types";

export default function useAuth(): UseAuthHook {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const signUpMutation = useMutation({
		mutationFn: async (formData: SignUpFormData) => {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-up`,
				formData,
				{
					withCredentials: true
				}
			);
		},
		onSuccess: (_, formData) => {
			navigate("/verify-email", {
				state: {
					email: formData.email
				}
			});
		}
	});

	const verifyEmailMutation = useMutation({
		mutationFn: async (code: string) => {
			if (!code) throw new Error("Verification code is required");
			if (code.length !== 6)
				throw new Error("Verification code must be 6 digits");

			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email`,
				{ code },
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
		},
		onSuccess: () => {
			navigate("/"); // Redirect to the home page after successful sign-in
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
		signIn: signInMutation.mutateAsync,
		verifyEmail: verifyEmailMutation.mutateAsync
	};
}
