import { SignUpFormData } from "../schemas/signUp.schema.js";
import type { SignInFormData } from "../schemas/signIn.schema.js";

interface UseAuthHook {
	signOut: () => Promise<void>;
	signUp: (formData: SignUpFormData) => Promise<void>;
	signIn: (formData: SignInFormData) => Promise<void>;
	verifyEmail: (code: string) => Promise<void>;
}

export type { UseAuthHook };
