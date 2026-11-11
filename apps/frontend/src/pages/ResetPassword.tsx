import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetSchema } from "@repo/shared-types";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { z } from "zod";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";

export default function ResetPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<z.infer<typeof passwordResetSchema>>({
		resolver: zodResolver(passwordResetSchema)
	});
	const [searchParams] = useSearchParams();
	const { resetPassword } = useAuth();
	const navigate = useNavigate();

	const token = searchParams.get("token") ?? "";

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
			{!token ? (
				<div className="text-red-600 flex flex-col space-y-3 items-center justify-center text-sm mb-2">
					<h1 className="text-xl font-semibold">
						Password Reset Token Is Missing
					</h1>
					<Link
						to="/sign-in"
						className="inline-flex w-fit text-lg items-center gap-2 text-novice-ink-blue hover:underline"
					>
						<FaArrowLeftLong />
						Back to Sign In
					</Link>
				</div>
			) : (
				<div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900">
						Reset Your Password
					</h1>
					<div className="mb-6 flex flex-col gap-4 text-sm">
						<p>Choose a new password for your account.</p>
						<Link
							to="/sign-in"
							className="inline-flex w-fit items-center gap-2 text-novice-ink-blue hover:underline"
						>
							<FaArrowLeftLong />
							Back to Sign In
						</Link>
					</div>
					<form
						className="flex flex-col gap-4"
						onSubmit={handleSubmit(data => {
							resetPassword.mutate(
								{
									newPassword: data.newPassword,
									confirmedNewPassword: data.confirmedNewPassword
								},
								{
									onSuccess: () => {
										navigate("/sign-in");
									}
								}
							);
						})}
					>
						<div className="flex flex-col space-y-6">
							<div className="flex flex-col">
								<label
									htmlFor="newPassword"
									className={`text-sm ${!errors.newPassword && "mb-2"} text-slate-800`}
								>
									New Password <span className="ml-1 text-red-600">*</span>
								</label>
								{errors.newPassword && (
									<p className="text-red-600 text-sm">
										{errors.newPassword.message}
									</p>
								)}
								<input
									type="password"
									id="newPassword"
									placeholder="New Password"
									{...register("newPassword")}
									className={`rounded-md border border-gray-400 px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 ${errors.newPassword ? "border-red-600 focus:border-red-600 focus:ring-red-600/20" : "focus:border-novice-ink-blue focus:ring-novice-ink-blue/20"}`}
								/>
								<div>
									<p className="text-sm mt-1 text-slate-500">
										<IoIosInformationCircleOutline className="inline mr-1" />
										Password must be at least 8 characters long.
									</p>
								</div>
							</div>
							<div className="flex flex-col">
								<label
									htmlFor="confirmedNewPassword"
									className={`text-sm ${!errors.confirmedNewPassword && "mb-2"} text-slate-800`}
								>
									Confirm New Password{" "}
									<span className="ml-1 text-red-600">*</span>
								</label>
								{errors.confirmedNewPassword && (
									<p className="text-red-600 text-sm">
										{errors.confirmedNewPassword.message}
									</p>
								)}
								<input
									type="password"
									placeholder="Confirm New Password"
									id="confirmedNewPassword"
									{...register("confirmedNewPassword")}
									className={`rounded-md border border-gray-400 px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 ${errors.confirmedNewPassword ? "border-red-600 focus:border-red-600 focus:ring-red-600/20" : "focus:border-novice-ink-blue focus:ring-novice-ink-blue/20"}`}
								/>
								<div>
									<p className="text-sm mt-1 text-slate-500">
										<IoIosInformationCircleOutline className="inline mr-1" />
										Password must be at least 8 characters long.
									</p>
								</div>
							</div>
						</div>
						<button
							type="submit"
							className="mt-2 rounded-md bg-novice-ink-blue px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-novice-ink-blue focus-visible:ring-offset-2 hover:cursor-pointer"
							disabled={resetPassword.isPending}
						>
							{resetPassword.isPending ? "Resetting..." : "Reset Password"}
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
