import { Link, useLocation } from "react-router-dom";
import PasswordReset from "./PasswordReset";
import VerifyEmail from "./VerifyEmail";

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
	) : (
		<form className="w-1/2 space-y-4">
			<div className="flex flex-col space-y-3 mb-8 text-center">
				<h3 className="font-bold text-3xl">
					{currentAuthPage === "/sign-up" ? "Sign Up" : "Sign In"}
				</h3>
				{currentAuthPage === "/sign-up" ? (
					<p>
						Already have an account?{" "}
						<Link to="/sign-in" className="hover:underline text-blue-800">
							Sign In!
						</Link>
					</p>
				) : (
					<div className="flex space-y-3 flex-col">
						<p>
							Don't have an account?{" "}
							<Link to="/sign-up" className="hover:underline text-blue-800">
								Sign Up!
							</Link>
						</p>
						<p>
							Forgot your password?{" "}
							<Link
								to="/forgot-password"
								className="hover:underline text-blue-800"
							>
								Reset it!
							</Link>
						</p>
					</div>
				)}
			</div>
			<div className="flex flex-col space-y-6">
				{currentAuthPage === "/sign-up" && (
					<>
						<div className="flex flex-col">
							<label
								htmlFor="firstName"
								className="text-sm mb-2 text-slate-800"
							>
								First Name<span className="ml-1 text-red-600">*</span>
							</label>
							<input
								type="text"
								id="firstName"
								name="firstName"
								className="px-2 py-2.5 rounded-md border border-gray-400"
							/>
						</div>

						<div className="flex flex-col">
							<label htmlFor="lastName" className="text-sm mb-2 text-slate-800">
								Last Name<span className="ml-1 text-red-600">*</span>
							</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								className="px-2 py-2.5 rounded-md border border-gray-400"
							/>
						</div>
					</>
				)}

				<div className="flex flex-col">
					<label htmlFor="email" className="text-sm mb-2 text-slate-800">
						Email <span className="ml-1 text-red-600">*</span>
					</label>
					<input
						type="email"
						id="email"
						name="email"
						className="px-2 py-2.5 rounded-md border border-gray-400"
					/>
				</div>

				<div className="flex flex-col">
					<label htmlFor="password" className="text-sm mb-2 text-slate-800">
						Password <span className="ml-1 text-red-600">*</span>
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className="px-2 py-2.5 rounded-md border border-gray-400"
					/>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="confirmPassword"
						className="text-sm mb-2 text-slate-800"
					>
						Confirm Password <span className="ml-1 text-red-600">*</span>
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						className="px-2 py-2.5 rounded-md border border-gray-400"
					/>
				</div>
			</div>
			<button
				type="submit"
				className="w-full hover:cursor-pointer mt-5 py-3.5 rounded-md bg-novice-ink-blue text-sm text-white font-bold"
			>
				{currentAuthPage === "/sign-up" ? "SIGN UP" : "SIGN IN"}
			</button>
			{currentAuthPage === "/sign-up" && (
				<p className="text-center mt-2 text-sm text-slate-600">
					By signing up, you agree to our{" "}
					<Link to="/terms" className="text-blue-800">
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link to="/privacy" className="text-blue-800">
						Privacy Policy
					</Link>
					.
				</p>
			)}
		</form>
	);
}
