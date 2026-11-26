import timeline from "../../json/timeline.json";
import TimelineEvent from "./TimelineEvent";

export default function Timeline() {
	return (
		<div className="container mx-auto w-full h-full">
			<div className="relative wrap overflow-hidden p-10 h-full">
				<div
					className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border"
					style={{ left: "50%" }}
				></div>
				{timeline.map((event, index) => (
					<TimelineEvent
						key={index}
						number={index + 1}
						direction={event.direction as "right" | "left"}
						title={event.title}
						date={event.date}
						description={event.description}
					/>
				))}
			</div>
		</div>
	);
}
