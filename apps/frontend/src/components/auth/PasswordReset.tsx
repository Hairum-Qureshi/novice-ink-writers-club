import { Link } from "react-router-dom";

export default function PasswordReset() {
	return (
		<form className="w-1/2 space-y-4">
			<div className="flex flex-col space-y-3 mb-8">
				<div className="text-center flex flex-col space-y-3">
					<h3 className="font-bold text-3xl">Password Reset</h3>
					<p>
						Already have an account?{" "}
						<Link to="/sign-in" className="hover:underline text-blue-800">
							Sign In!
						</Link>
					</p>
					<p>
						Don't have an account?{" "}
						<Link to="/sign-up" className="hover:underline text-blue-800">
							Sign Up!
						</Link>
					</p>
				</div>
				<div className="flex flex-col mt-5">
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
			</div>
			<button
				type="submit"
				className="w-full hover:cursor-pointer mt-5 py-3.5 rounded-md bg-novice-ink-blue text-sm text-white font-bold"
			>
				Reset Password
			</button>
		</form>
	);
}
