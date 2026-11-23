export default function TimelineEvent({
	number,
	direction,
	title,
	date,
	description
}: {
	number: number;
	direction: "left" | "right";
	title: string;
	date: string;
	description: string;
}) {
	return (
		<div
			className={`mb-8 flex justify-between items-center w-full ${direction === "left" ? "flex-row" : "flex-row-reverse"}`}
		>
			<div className="order-1 w-5/12"></div>
			<div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
				<h1 className="mx-auto font-semibold text-lg text-white font-alike-angular">
					{number}
				</h1>
			</div>
			<div className="order-1 rounded-lg shadow-xl w-5/12 px-6 py-4">
				<h3 className="text-xl leading-snug tracking-wide font-alike-angular mb-2 text-amber-300 text-center">
					{date}
				</h3>
				<h3 className="mb-3 font-bold text-xl text-white font-alike-angular">
					{title}
				</h3>
				<p className="text-base leading-snug tracking-wide text-white font-lusitana">
					{description}
				</p>
			</div>
		</div>
	);
}
