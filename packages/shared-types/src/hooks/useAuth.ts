import type { SignUpFormData } from "../schemas/signUp.schema.js";
import type { SignInFormData } from "../schemas/signIn.schema.js";

interface UseAuthHook {
	signOut: {
		mutate: (options?: { onSuccess?: (data: void) => void }) => void;
		isPending: boolean;
		isError: boolean;
	};
	signUp: {
		mutate: (
			formData: SignUpFormData,
			options?: { onSuccess?: (data: void, formData: SignUpFormData) => void }
		) => void;
		isPending: boolean;
		error: unknown;
		isError: boolean;
	};
	signIn: {
		mutate: (
			formData: SignInFormData,
			options?: { onSuccess?: (data: void) => void }
		) => void;
		isPending: boolean;
		error: unknown;
		isError: boolean;
	};
	verifyEmail: {
		mutate: (
			code: string,
			options?: { onSuccess?: (data: void) => void }
		) => void;
		reset: () => void;
		isPending: boolean;
		error: unknown;
		isError: boolean;
	};
	resendVerificationEmail: {
		mutate: (
			email: string,
			options?: { onSuccess?: (data: void, email: string) => void }
		) => void;
		reset: () => void;
		isPending: boolean;
		error: unknown;
		isError: boolean;
	};
	forgotPassword: {
		mutate: (
			email: string,
			options?: { onSuccess?: (data: void, email: string) => void }
		) => void;
		reset: () => void;
		isPending: boolean;
		error: unknown;
		isError: boolean;
	};
	resetPassword: {
		mutate: (
			formData: { newPassword: string; confirmedNewPassword: string },
			options?: {
				onSuccess?: (data: void) => void;
			}
		) => void;
		reset: () => void;
		isPending: boolean;
		error: unknown;
		isError: boolean;
	};
}

export type { UseAuthHook };
