import { useState } from "react";
import FAQ from "./FAQ";
import FAQJSON from "../json/FAQs.json";

export default function FAQs() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<div
			id="accordion-flush"
			data-accordion="collapse"
			data-active-classes="bg-neutral-primary text-heading"
			data-inactive-classes="text-body"
			className="my-4"
		>
			{FAQJSON.map((faq, index) => (
				<FAQ
					key={index}
					index={index}
					openIndex={openIndex}
					setOpenIndex={setOpenIndex}
					question={faq.question}
					answer={faq.answer}
				/>
			))}
		</div>
	);
}
