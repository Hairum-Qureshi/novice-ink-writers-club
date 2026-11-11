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
		reset: () => void;
		isPending: boolean;
		isError: boolean;
	};
	signIn: {
		mutate: (
			formData: SignInFormData,
			options?: { onSuccess?: (data: void) => void }
		) => void;
		reset: () => void;
		isPending: boolean;
		isError: boolean;
	};
	verifyEmail: {
		mutate: (
			code: string,
			options?: { onSuccess?: (data: void) => void }
		) => void;
		reset: () => void;
		isPending: boolean;
		isError: boolean;
	};
	resendVerificationEmail: {
		mutate: (
			email: string,
			options?: { onSuccess?: (data: void, email: string) => void }
		) => void;
		reset: () => void;
		isPending: boolean;
		isError: boolean;
	};
}

export type { UseAuthHook };
