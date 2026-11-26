import FAQs from "../components/FAQs";
import Timeline from "../components/Timeline";
import { Link } from "react-router-dom";
import { IoVideocam } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import clubServices from "../json/club-services.json";

const icons = {
	IoVideocam,
	FaFileUpload,
	FaUserEdit,
	FaBookOpen
};

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
						<h1 className="text-7xl lg:text-8xl font-bold font-lusitana">
							Novice Ink. Writer's Club
						</h1>
						<h2 className="text-5xl p-5 font-bold rounded-sm mt-5 font-lusitana">
							Christiana High School
						</h2>
					</div>
				</div>
			</div>
			<div className="bg-[#211d1a] h-auto p-20 flex items-center justify-between">
				<div className="flex-1">
					<h1 className="text-5xl font-bold uppercase font-lusitana text-amber-300">
						About Us
					</h1>
					<p className="my-4 text-base text-white font-alike-angular">
						Hey! Welcome to Novice Ink., a creative writing club at Christiana
						High School. Our primary focus is to help our members improve their
						creative writing skills through practice exercises, discussions, and
						so much more.
						<br />
						<br />
						Beyond that, we hope to provide a space where you can develop a love
						for writing and literature. We welcome everyone to join us, even if
						writing isn't your strong suit. After all, each of us has a unique
						way of telling a story—it just takes time, patience, effort, and
						plenty of creativity! By using this site, you agree to our{" "}
						<Link to="/terms-and-conditions">Terms & Conditions</Link>.
					</p>
				</div>
				<div className="flex-1 flex items-center justify-center">
					<img
						src="/assets/Christiana-High-School-Logo.png"
						alt="Christiana High School Logo"
						className="w-1/2 h-1/2 rounded-full border border-yellow-300"
					/>
				</div>
			</div>
			<section className="bg-[#16130f] px-6 py-20 md:px-12 lg:px-20">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col items-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold text-center uppercase font-lusitana text-amber-300 tracking-wide">
							Our Club Services
						</h1>

						<div className="w-1/3 h-[2px] bg-amber-300 mt-6" />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{clubServices.map((service, index) => {
							const Icon = icons[service.icon as keyof typeof icons];

							return (
								<div
									key={index}
									className="group bg-[#211d1a] border border-amber-300/10 rounded-xl p-8 flex flex-col gap-5 transition-all duration-300 hover:border-amber-300/40 hover:bg-[#28231e]"
								>
									<div className="w-14 h-14 rounded-lg bg-amber-300/10 flex items-center justify-center text-amber-300">
										<Icon className="text-2xl" />
									</div>

									<div className="flex flex-col gap-3">
										<h2 className="text-2xl font-bold font-lusitana text-amber-100">
											{service.title}
										</h2>

										<p className="text-stone-400 text-base leading-relaxed font-alike-angular">
											{service.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>
			<div className="bg-[#121510] h-auto p-20">
				<h1 className="text-5xl font-bold uppercase font-lusitana text-amber-300 text-center">
					History of Novice Ink.
				</h1>
				<div>
					<Timeline />
				</div>
			</div>
			<div className="bg-[#172118] h-auto p-20">
				<h1 className="text-5xl font-bold uppercase font-lusitana text-amber-300 text-center">
					Frequently Asked Questions
				</h1>
				<div>
					<FAQs />
				</div>
			</div>
		</div>
	);
}
