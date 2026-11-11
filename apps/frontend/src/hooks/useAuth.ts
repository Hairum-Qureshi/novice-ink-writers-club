import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SignUpFormData, SignInFormData } from "@repo/shared-types";
import { useSearchParams } from "react-router-dom";

export default function useAuth() {
	const queryClient = useQueryClient();
	const [searchParams] = useSearchParams();

	const token = searchParams.get("token") ?? "";

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
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["currentUser"] })
	});

	const resendMutation = useMutation({
		mutationFn: async (email: string) => {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-verification-email`,
				{ email },
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
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["currentUser"] })
	});

	const forgotPasswordMutation = useMutation({
		mutationFn: async (email: string) => {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
				{ email },
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

	const resetPasswordMutation = useMutation({
		mutationFn: async (formData: {
			newPassword: string;
			confirmedNewPassword: string;
		}) => {
			if (!token) throw new Error("Token is required");

			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password?token=${token}`,
				formData,
				{
					withCredentials: true
				}
			);
		}
	});

	return {
		signOut: {
			mutate: (options?: { onSuccess?: (data: void) => void }) =>
				signOutMutation.mutate(undefined, options),
			isPending: signOutMutation.isPending,
			isError: signOutMutation.isError
		},
		signUp: signUpMutation,
		signIn: signInMutation,
		verifyEmail: verifyEmailMutation,
		resendVerificationEmail: resendMutation,
		forgotPassword: forgotPasswordMutation,
		resetPassword: resetPasswordMutation
	};
}
