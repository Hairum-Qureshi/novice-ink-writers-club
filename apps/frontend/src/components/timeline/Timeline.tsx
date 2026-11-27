import timeline from "../../json/timeline.json";
import TimelineEvent from "./TimelineEvent";

export default function Timeline() {
	return (
		<div className="container mx-auto w-full h-full">
			<div className="relative overflow-hidden p-0 lg:p-10 h-full">
				<div className="absolute top-0 bottom-0 left-4 lg:left-1/2 -translate-x-1/2 w-1 bg-gray-700" />
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
