import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SignUpFormData } from "@repo/shared-types";
import { signUpSchema } from "@repo/shared-types";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

export default function SignUpForm() {
	const { signUp } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema)
	});

	return (
		<form
			className="w-1/2 space-y-4"
			onSubmit={handleSubmit((data, e) => {
				e?.preventDefault();
				signUp.mutate(data, {
					onSuccess: () => {
						navigate("/verify-email", {
							state: {
								email: data.email
							}
						});
					}
				});
			})}
		>
			<div className="flex flex-col space-y-3 mb-8 text-center">
				<h3 className="font-bold text-3xl">Sign Up</h3>
				<p>
					Already have an account?{" "}
					<Link to="/sign-in" className="hover:underline text-blue-800">
						Sign In!
					</Link>
				</p>
			</div>
			<div className="flex flex-col space-y-6">
				<div className="flex flex-col">
					<label
						htmlFor="firstName"
						className={`text-sm ${!errors.firstName && "mb-2"} text-slate-800`}
					>
						First Name<span className="ml-1 text-red-600">*</span>
					</label>
					{errors.firstName && (
						<p className="text-red-600 text-sm">{errors.firstName.message}</p>
					)}
					<input
						type="text"
						id="firstName"
						className="px-2 py-2.5 rounded-md border border-gray-400"
						{...register("firstName")}
					/>
				</div>
				<div className="flex flex-col">
					<label
						htmlFor="lastName"
						className={`text-sm ${!errors.lastName && "mb-2"} text-slate-800`}
					>
						Last Name<span className="ml-1 text-red-600">*</span>
					</label>
					{errors.lastName && (
						<p className="text-red-600 text-sm">{errors.lastName.message}</p>
					)}
					<input
						type="text"
						id="lastName"
						{...register("lastName")}
						className="px-2 py-2.5 rounded-md border border-gray-400"
					/>
				</div>
				<div className="flex flex-col">
					<label
						htmlFor="email"
						className={`text-sm ${!errors.email && "mb-2"} text-slate-800`}
					>
						Email <span className="ml-1 text-red-600">*</span>
					</label>
					{errors.email && (
						<p className="text-red-600 text-sm">{errors.email.message}</p>
					)}
					<input
						type="email"
						id="email"
						{...register("email")}
						className="px-2 py-2.5 rounded-md border border-gray-400"
					/>
				</div>
				<div className="flex flex-col">
					<label
						htmlFor="password"
						className={`text-sm ${!errors.password && "mb-2"} text-slate-800`}
					>
						Password <span className="ml-1 text-red-600">*</span>
					</label>
					{errors.password && (
						<p className="text-red-600 text-sm">{errors.password.message}</p>
					)}
					<input
						type="password"
						id="password"
						{...register("password")}
						className={`px-2 py-2.5 rounded-md border border-gray-400 ${errors.password && "border-red-600"}`}
					/>
				</div>
				<div className="flex flex-col">
					<label
						htmlFor="confirmPassword"
						className={`text-sm ${!errors.confirmPassword && "mb-2"} text-slate-800`}
					>
						Confirm Password <span className="ml-1 text-red-600">*</span>
					</label>
					{errors.confirmPassword && (
						<p className="text-red-600 text-sm">
							{errors.confirmPassword.message}
						</p>
					)}
					<input
						type="password"
						id="confirmPassword"
						{...register("confirmPassword")}
						className={`px-2 py-2.5 rounded-md border border-gray-400 ${errors.confirmPassword && "border-red-600"}`}
					/>
				</div>
			</div>
			<button
				type="submit"
				className="w-full hover:cursor-pointer mt-5 py-3.5 rounded-md bg-novice-ink-blue text-sm text-white font-bold"
				disabled={signUp.isPending}
			>
				{signUp.isPending ? "SIGNING UP..." : "SIGN UP"}
			</button>
			{signUp.isError && (
				<p role="alert" className="text-center text-sm text-red-600">
					{axios.isAxiosError<ApiError>(signUp.error)
						? signUp.error.response?.data?.message
						: "Unable to sign up. Please try again."}
				</p>
			)}
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
		</form>
	);
}
