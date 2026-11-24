import magazines from "../json/magazines.json";
import { FaBook, FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function Magazines() {
	return (
		<div className="min-h-[calc(100vh-5rem)] bg-[#1b2d1f] px-6 py-10">
			<header className="mb-12 text-center">
				<h1 className="text-4xl text-novice-ink-yellow font-dancing-script">
					Magazine Editions
				</h1>
				<p className="mt-3 text-sm text-white/60 font-alike-angular">
					Explore our collection of past literary publications.
				</p>
			</header>

			<div className="mx-auto max-w-3xl space-y-8">
				{magazines.map(magazine => (
					<section key={magazine.title}>
						{/* Year heading */}
						<div className="flex items-center gap-4 mb-4">
							<h2 className="text-2xl font-medium text-white font-alike-angular">
								{magazine.year}
							</h2>
							<hr className="flex-1 border-white/25" />
						</div>

						{/* Magazine edition */}
						<a
							href={magazine.file}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center gap-4 p-5 border
								border-novice-ink-yellow/60 rounded-md bg-white/[0.03]
								hover:bg-white/[0.07] hover:border-novice-ink-yellow
								transition-colors duration-200"
						>
							<FaBook className="shrink-0 text-xl text-novice-ink-yellow" />

							<div className="flex-1">
								<h3 className="font-medium text-white group-hover:text-novice-ink-yellow transition-colors">
									{magazine.title}
								</h3>
								<p className="mt-1 text-xs text-white/50">PDF Document</p>
							</div>

							<FaArrowUpRightFromSquare className="shrink-0 text-sm text-novice-ink-yellow" />
						</a>
					</section>
				))}
			</div>
		</div>
	);
}
