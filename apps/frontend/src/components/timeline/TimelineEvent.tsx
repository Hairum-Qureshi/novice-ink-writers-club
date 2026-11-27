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
			className={`mb-8 flex items-center w-full gap-4 lg:gap-0 lg:justify-between ${
				direction === "left" ? "flex-row" : "sm:flex-row lg:flex-row-reverse"
			}`}
		>
			<div className="hidden lg:block lg:order-1 lg:w-5/12" />
			<div className="z-20 flex shrink-0 items-center justify-center lg:order-1 bg-gray-800 w-8 h-8 rounded-full">
				<h1 className="font-semibold text-lg text-white font-alike-angular">
					{number}
				</h1>
			</div>
			<div className="order-1 flex-1 min-w-0 rounded-lg lg:flex-none lg:w-5/12 lg:px-6 py-4">
				<h3 className="text-xl leading-snug tracking-wide font-alike-angular mb-2 text-amber-300 lg:text-center">
					{date}
				</h3>
				<h3 className="mb-3 font-bold text-2xl text-slate-100 font-alike-angular">
					{title}
				</h3>
				<p className="text-base leading-snug tracking-wide text-gray-400 font-lusitana">
					{description}
				</p>
			</div>
		</div>
	);
}
