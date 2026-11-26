import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

export default function FAQ({
	question,
	answer,
	index,
	openIndex,
	setOpenIndex
}: {
	index: number;
	openIndex: number | null;
	setOpenIndex: (index: number | null) => void;
	question: string;
	answer: string;
}) {
	return (
		<div>
			<h2 id={`accordion-flush-heading-${index}`}>
				<button
					type="button"
					className="flex items-center hover:cursor-pointer justify-between w-full py-5 font-medium rtl:text-right text-yellow-400 border-b border-default gap-3"
					data-accordion-target={`#accordion-flush-body-${index}`}
					aria-expanded={openIndex === index}
					aria-controls={`accordion-flush-body-${index}`}
					onClick={() => setOpenIndex(openIndex === index ? null : index)}
				>
					<span className="text-lg font-alike-angular text-yellow-400">
						{question}
					</span>
					{openIndex === index ? (
						<FaChevronUp
							data-accordion-icon
							className="w-5 h-5 shrink-0 text-yellow-400"
							aria-hidden="true"
						/>
					) : (
						<FaChevronDown
							data-accordion-icon
							className="w-5 h-5 shrink-0 text-yellow-400"
							aria-hidden="true"
						/>
					)}
				</button>
			</h2>
			<div
				id={`accordion-flush-body-${index}`}
				className={openIndex === index ? "block" : "hidden"}
				aria-labelledby={`accordion-flush-heading-${index}`}
			>
				<div className="py-5 border-b border-yellow-400 border-default">
					<p className="mb-2 text-lg font-poor-story text-white">{answer}</p>
				</div>
			</div>
		</div>
	);
}
