import { Navigate, useParams } from "react-router-dom";
import type { Genre as GenreEnum } from "@repo/shared-types";
import StoryCard from "../components/cards/StoryCard";
import useGenre from "../hooks/useGenre";
import { useState } from "react";
import prerequisites from "../json/prerequisites.json";
import sideRules from "../json/side-rules.json";
import { MdOutlineFileUpload } from "react-icons/md";

export default function Genre() {
	const { genre } = useParams();
	const { getAllPublishedStories } = useGenre();

	const [activeTab, setActiveTab] = useState<"prerequisites" | "rules">(
		"prerequisites"
	);

	const tabs: { id: "prerequisites" | "rules"; label: string }[] = [
		{ id: "prerequisites", label: "Prerequisites" },
		{ id: "rules", label: "Side Rules" }
	];

	const fillerWord =
		genre === "essays" ? "essay" : genre === "poetry" ? "poem" : "story";

	if (
		!genre ||
		![
			"apocalyptic",
			"poetry",
			"essays",
			"dystopian",
			"mystery",
			"sci-fi",
			"fantasy"
		].includes(genre)
	)
		return <Navigate to="/" />;

	return (
		<main>
			<div className="min-h-[calc(100vh-5rem)] bg-[#111c0f] py-8 text-white">
				<div className="mx-auto max-w-6xl space-y-10 px-4">
					{/* Genre introduction */}
					<section className="flex min-h-64 items-end rounded-lg border border-green-800/70 bg-[#0f200f] p-8 md:p-10">
						<div className="max-w-2xl space-y-3">
							<h1 className="font-alike-angular text-4xl font-semibold text-white/90 md:text-5xl">
								{genre?.replace(/^\w/, c => c.toUpperCase())}
							</h1>

							<p className="font-alike-angular leading-relaxed text-white/70">
								Read through published {fillerWord}
								that students from Christiana High School have contributed to
								the Novice Ink. Writer's Club website.
							</p>
						</div>
					</section>

					<section className="space-y-6 mb-5">
						<div className="flex items-end justify-between border-b border-green-800/50 pb-4">
							<div className="space-y-1">
								<h2 className="font-alike-angular text-2xl font-semibold">
									Published{" "}
									{fillerWord.charAt(0).toUpperCase() + fillerWord.slice(1)}
								</h2>
							</div>

							<span className="text-sm text-white/50 font-alike-angular">
								{getAllPublishedStories.data?.length ?? 0}{" "}
								{(() => {
									const count = getAllPublishedStories.data?.length ?? 0;

									if (fillerWord === "poem" || fillerWord === "essay") {
										return count === 1 ? fillerWord : `${fillerWord}s`;
									}

									return count === 1 ? "story" : "stories";
								})()}
							</span>
						</div>

						{getAllPublishedStories.data?.length ? (
							getAllPublishedStories.data?.map(story => (
								<StoryCard
									key={story.id}
									authorName={story.authorName}
									title={story.title}
									storyId={story.id}
									description={story.description}
									datePosted={new Date(story.createdAt).toLocaleDateString()}
									genre={genre as GenreEnum}
								/>
							))
						) : (
							<p className="text-white/50 text-center py-4 text-lg font-alike-angular">
								Nothing was published for this genre.
							</p>
						)}
					</section>
				</div>
			</div>
			<section className="min-h-screen bg-[#122a17] px-5 py-20 text-white">
				<div className="mx-auto max-w-6xl">
					<header className="mb-12 space-y-4">
						<h1 className="font-alike-angular text-4xl font-semibold tracking-tight text-white/95 md:text-5xl">
							Submission Guidelines
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-white/60 font-alike-angular">
							Explore the original submission requirements, guidelines, and
							rules established by the club.
						</p>
					</header>
					<div
						role="tablist"
						aria-label="Submission guidelines"
						className="flex gap-10 border-b border-white/20"
					>
						{tabs.map(tab => (
							<button
								key={tab.id}
								id={`tab-${tab.id}`}
								type="button"
								role="tab"
								aria-selected={activeTab === tab.id}
								aria-controls={`panel-${tab.id}`}
								onClick={() => setActiveTab(tab.id)}
								className={`relative cursor-pointer pb-4 font-alike-angular text-lg transition-colors duration-200 ${
									activeTab === tab.id
										? "text-white"
										: "text-white/50 hover:text-white/80"
								}`}
							>
								{tab.label}
								<span
									className={`absolute bottom-[-1px] left-0 h-[2px] w-full bg-green-300 transition-transform duration-200 ${
										activeTab === tab.id ? "scale-x-100" : "scale-x-0"
									}`}
								/>
							</button>
						))}
					</div>

					<div
						id={`panel-${activeTab}`}
						role="tabpanel"
						aria-labelledby={`tab-${activeTab}`}
						className="max-w-4xl py-12"
					>
						{(() => {
							const isPrerequisites = activeTab === "prerequisites";
							const items = isPrerequisites ? prerequisites : sideRules;

							return (
								<div>
									<div className="mb-10 space-y-2">
										<h2 className="font-alike-angular text-3xl font-semibold text-white/90">
											{isPrerequisites
												? "Before You Submit"
												: "Additional Rules"}
										</h2>
										<p className="text-sm text-white/50 font-alike-angular">
											{isPrerequisites
												? "Please review these requirements before submitting your work."
												: "Additional information regarding story submissions."}
										</p>
									</div>
									<div className="divide-y divide-green-300/15 border-t border-green-300/15">
										{items.map(item => (
											<div
												key={item.number}
												className="group grid grid-cols-[2.5rem_1fr] gap-5 py-4 md:grid-cols-[3.5rem_1fr] md:gap-8"
											>
												<span className="font-alike-angular text-2xl text-green-300/50 transition-colors group-hover:text-green-200">
													{String(item.number).padStart(2, "0")}
												</span>
												<div className="space-y-3">
													<h3 className="font-alike-angular text-xl font-medium text-white/90">
														{item.title}
													</h3>

													<p className="max-w-2xl text-base font-alike-angular leading-7 text-white/65">
														{item.description}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							);
						})()}
					</div>
				</div>
			</section>
			<section className="min-h-screen bg-[#112114] px-5 py-20 text-white">
				<div className="mx-auto max-w-6xl">
					<header className="mb-12 space-y-4">
						<h1 className="font-alike-angular text-4xl font-semibold tracking-tight text-white/95 md:text-5xl">
							Submit Your{" "}
							{fillerWord.charAt(0).toUpperCase() + fillerWord.slice(1)}
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-white/60 font-alike-angular">
							Submit your {fillerWord} for review by the club admins for a
							chance to be published on the website.
						</p>
					</header>
					<form
						className="space-y-8 border-t border-green-300/20 pt-10"
						onSubmit={e => {
							e.preventDefault();
							alert("This feature is no longer in service");
						}}
					>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div>
								<label
									htmlFor="firstName"
									className="mb-2 block font-alike-angular text-sm font-medium text-white/80"
								>
									First Name <span className="text-green-300">*</span>
								</label>

								<input
									type="text"
									id="firstName"
									name="firstName"
									placeholder="Enter your first name"
									autoComplete="given-name"
									required
									className="w-full rounded-md border border-green-300/20 bg-[#0f3a17] px-4 py-3 text-sm text-white/90 outline-none transition-colors placeholder:text-white/30 focus:border-green-300/70 focus:ring-2 focus:ring-green-300/10"
								/>
							</div>

							<div>
								<label
									htmlFor="lastName"
									className="mb-2 block font-alike-angular text-sm font-medium text-white/80"
								>
									Last Name <span className="text-green-300">*</span>
								</label>

								<input
									type="text"
									id="lastName"
									name="lastName"
									placeholder="Enter your last name"
									autoComplete="family-name"
									required
									className="w-full rounded-md border border-green-300/20 bg-[#0f3a17] px-4 py-3 text-sm text-white/90 outline-none transition-colors placeholder:text-white/30 focus:border-green-300/70 focus:ring-2 focus:ring-green-300/10"
								/>
							</div>
						</div>

						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="mb-2 block font-alike-angular text-sm font-medium text-white/80"
							>
								Email Address <span className="text-green-300">*</span>
							</label>

							<input
								type="email"
								id="email"
								name="email"
								placeholder="you@example.com"
								autoComplete="email"
								required
								className="w-full rounded-md border border-green-300/20 bg-[#0f3a17] px-4 py-3 text-sm text-white/90 outline-none transition-colors placeholder:text-white/30 focus:border-green-300/70 focus:ring-2 focus:ring-green-300/10"
							/>

							<p className="mt-2 text-xs text-white/45">
								Please use a personal email address, not your school email.
							</p>
						</div>
						{/* File Upload */}
						<div>
							<label
								htmlFor="storyFile"
								className="mb-2 block font-alike-angular text-sm font-medium text-white/80"
							>
								Upload Story <span className="text-green-300">*</span>
							</label>

							<label
								htmlFor="storyFile"
								className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-green-300/30 bg-[#0f3a17]/70 px-6 py-10 text-center transition-colors hover:border-green-300/60 hover:bg-[#0f3a17]"
							>
								<MdOutlineFileUpload className="text-green-200/70" size={28} />

								<span className="font-alike-angular text-sm text-white/80">
									Choose a document to upload
								</span>

								<span className="text-xs text-white/40">DOCX files only</span>

								<input
									type="file"
									id="storyFile"
									name="storyFile"
									accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
									required
									className="sr-only"
								/>
							</label>
						</div>

						<div>
							<label
								htmlFor="additionalInfo"
								className="mb-2 block font-alike-angular text-sm font-medium text-white/80"
							>
								Additional Information
								<span className="ml-2 text-xs font-normal text-white/40 font-alike-angular">
									Optional
								</span>
							</label>

							<textarea
								id="additionalInfo"
								name="additionalInfo"
								rows={5}
								placeholder="Include any additional details about your submission..."
								className="w-full rounded-md border border-green-300/20 bg-[#0f3a17] px-4 py-3 text-sm text-white/90 outline-none transition-colors placeholder:text-white/30 focus:border-green-300/70 focus:ring-2 focus:ring-green-300/10 resize-y"
							/>

							<p className="mt-2 text-xs text-white/45 font-alike-angular">
								Use this field for relevant notes about your story.
							</p>
						</div>

						<div>
							<label className="flex items-center gap-2 text-white/80">
								<input
									type="checkbox"
									name="confirmGuidelines"
									required
									className="h-4 w-4 rounded border-green-300/20 bg-[#0f3a17] text-green-300 focus:ring-2 focus:ring-green-300/10"
								/>
								<span className="text-sm font-alike-angular">
									I confirm that I have reviewed the submission guidelines and
									requirements.
								</span>
							</label>
						</div>
						<div className="flex flex-col gap-5 border-t border-green-300/20 pt-8">
							<button
								type="submit"
								className="w-full cursor-pointer rounded-md bg-green-200 px-8 py-3 font-alike-angular text-sm font-semibold text-[#0d1a10] transition-colors hover:bg-green-100 sm:w-fit"
							>
								Submit Story
							</button>
						</div>
					</form>
				</div>
			</section>
		</main>
	);
}
