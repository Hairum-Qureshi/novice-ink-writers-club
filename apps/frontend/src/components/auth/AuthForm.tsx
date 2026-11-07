import { useLocation } from "react-router-dom";
import PasswordReset from "./PasswordReset";
import VerifyEmail from "./VerifyEmail";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";

export default function AuthForm() {
	const location = useLocation();
	const currentAuthPage = location.pathname as
		| "/sign-up"
		| "/sign-in"
		| "/forgot-password"
		| "/verify-email";

	return currentAuthPage === "/forgot-password" ? (
		<PasswordReset />
	) : currentAuthPage === "/verify-email" ? (
		<VerifyEmail />
	) : currentAuthPage === "/sign-up" ? (
		<SignUpForm />
	) : (
		<SignInForm />
	);
}
