import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@repo/shared-types";
import { z } from "zod";
import useAuth from "../../hooks/useAuth";

export default function SignInForm() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema)
	});

	const { signIn } = useAuth();

	return (
		<form
			className="w-1/2 space-y-4"
			onSubmit={handleSubmit((data, e) => {
				e?.preventDefault();
				signIn(data);
			})}
		>
			<div className="flex flex-col space-y-3 mb-8 text-center">
				<h3 className="font-bold text-3xl">Sign In</h3>
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
			</div>
			<div className="flex flex-col space-y-6">
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
			</div>
			<button
				type="submit"
				className="w-full hover:cursor-pointer mt-5 py-3.5 rounded-md bg-novice-ink-blue text-sm text-white font-bold"
			>
				SIGN IN
			</button>
		</form>
	);
}
