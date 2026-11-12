import AuthPageGif from "../assets/auth-page-background.gif";
import AuthForm from "../components/auth/AuthForm";

export default function Auth() {
	return (
		<div className="w-full flex h-screen">
			<div className="w-1/2 relative">
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
					<div className="flex justify-center space-y-5 text-white items-center h-full flex-col">
						<h1 className="text-5xl font-alike-angular font-semibold">
							Novice Ink.
						</h1>
						<p className="text-lg font-lusitana">
							Where creativity flourishes with the help of friends.
						</p>
					</div>
				</div>
				<img
					src={AuthPageGif}
					alt="Auth Page Background"
					className="w-full h-full object-cover object-left"
				/>
			</div>
			<div className="w-1/2 flex items-center justify-center h-full">
				<AuthForm />
			</div>
		</div>
	);
}
