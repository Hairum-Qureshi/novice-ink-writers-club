import background from "../assets/background.gif";

export default function Home() {
	return (
		<div className="min-h-screen max-h-auto p-10 bg-white relative overflow-hidden flex flex-col">
			<img
				src={background}
				alt="Background"
				className="absolute inset-0 w-full h-full object-cover"
			/>
		</div>
	);
}
