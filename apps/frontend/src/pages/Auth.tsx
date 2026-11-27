import AuthForm from "../components/auth/AuthForm";

export default function Auth() {
	return (
		<div className="w-full flex lg:flex-row flex-col h-screen">
			<div className="w-full lg:w-1/2 relative">
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
					src="/assets/auth-page-background.gif"
					alt="Auth Page Background"
					className="w-full h-full object-cover object-left"
				/>
			</div>
			<div className="w-full lg:w-1/2 flex items-center justify-center h-full lg:my-0 my-10">
				<AuthForm />
			</div>
		</div>
	);
}
