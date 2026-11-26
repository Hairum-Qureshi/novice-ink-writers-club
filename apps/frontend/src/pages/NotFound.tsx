import { Link, useNavigate } from "react-router-dom";
import { TbAlertTriangleFilled } from "react-icons/tb";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="relative min-h-screen">
			<img
				src="/assets/background.gif"
				alt=""
				aria-hidden="true"
				className="absolute inset-0 h-full w-full object-cover"
			/>

			<div className="absolute inset-0 bg-black/30" />

			<div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6">
				<div className="w-full -mt-25 max-w-xl border border-yellow-300/70 bg-[#1b1b1b]/85 p-6 shadow-xl backdrop-blur-sm sm:p-8">
					<div className="flex items-center gap-3">
						<TbAlertTriangleFilled
							className="text-3xl shrink-0 text-yellow-300"
							aria-hidden="true"
						/>
						<h1 className="text-xl font-bold text-white sm:text-3xl font-alike-angular">
							Oops! Page Not Found
						</h1>
					</div>

					<hr className="my-4 border-t-[3px] border-neutral-200" />

					{/* Description */}
					<p className="text-base leading-relaxed text-neutral-200 sm:text-lg font-alike-angular">
						The page you're looking for cannot be found or no longer exists. You
						may have clicked an expired link or mistyped the address. Please
						double-check the URL and try again.
					</p>

					{/* Navigation */}
					<div className="mt-6 flex flex-col items-start gap-1">
						<Link
							to="/"
							className="font-medium text-yellow-300 transition-colors hover:text-yellow-100 hover:underline"
						>
							Go Home
						</Link>

						<button
							type="button"
							onClick={() => navigate(-1)}
							className="cursor-pointer font-medium text-yellow-300 transition-colors hover:text-yellow-100 hover:underline"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
