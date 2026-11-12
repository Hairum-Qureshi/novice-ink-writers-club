import background from "../assets/background.gif";

export default function Home() {
	return (
		<div className="p-10 bg-white relative h-screen overflow-hidden flex flex-col">
			<img
				src={background}
				alt="Background"
				className="absolute inset-0 w-full h-full object-cover"
			/>
			<div className="flex bottom-15 flex-col items-center justify-center h-full relative text-white">
				<div className="bg-black/50 p-10 rounded-sm text-center">
					<h1 className="text-8xl font-bold font-lusitana">
						Novice Ink. Writer's Club
					</h1>
					<h2 className="text-5xl p-5 font-bold rounded-sm mt-5 font-lusitana">
						Christiana High School
					</h2>
				</div>
			</div>
		</div>
	);
}
