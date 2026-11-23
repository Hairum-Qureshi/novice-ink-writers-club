import Timeline from "../components/Timeline";

export default function Home() {
	return (
		<div>
			<div className="p-10 bg-[#DCE0D9] relative h-screen overflow-hidden flex flex-col">
				<img
					src="/assets/background.gif"
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
			<div className="bg-black h-auto p-20">
				<h1 className="text-5xl font-bold uppercase font-lusitana text-amber-300 text-center">
					History of Novice Ink.
				</h1>
				<div>
					<Timeline />
				</div>
			</div>
		</div>
	);
}
