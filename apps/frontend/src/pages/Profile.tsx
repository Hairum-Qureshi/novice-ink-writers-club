import UserStoryCard from "../components/UserStoryCard";
import { FiBookOpen, FiCamera, FiUser } from "react-icons/fi";
import { useRef, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import useUser from "../hooks/useUser";
import useGenre from "../hooks/useGenre";
import { IoMale } from "react-icons/io5";
import { IoFemale } from "react-icons/io5";
import { FaRegCalendarAlt, FaUserGraduate } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { SettingsForm } from "../components/SettingsForm";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
	const currentUser = useAuthStore(state => state.user);
	const { getUserById, updateUserPfp, updateUserBackdrop, deleteAccount } =
		useUser();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"stories" | "settings">("stories");

	const profileUser = getUserById.data ?? null;
	const isYourProfile = Boolean(
		currentUser && profileUser && currentUser.id === profileUser.id
	);
	const canManageSettings = isYourProfile && !profileUser?.isLegacyMember;
	const isSettingsTabActive = canManageSettings && activeTab === "settings";
	const profileImageInputRef = useRef<HTMLInputElement>(null);
	const backdropImageInputRef = useRef<HTMLInputElement>(null);

	const { getAllPublishedUserContent } = useGenre();

	return (
		<div className="min-h-[calc(100vh-5rem)] w-full bg-[#30382F] text-[#343a35]">
			{/* Hero */}
			<div className="relative h-72 overflow-hidden">
				<img
					src={`${profileUser?.backdropImage}?v=${profileUser?.updatedAt}`}
					alt="Profile cover"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

				{isYourProfile && (
					<div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pb-16 text-white">
						<h1 className="font-lusitana text-5xl font-bold">
							Hello, {profileUser?.firstName} {profileUser?.lastName}
						</h1>
						<p className="mt-3 max-w-2xl font-lusitana text-lg text-white/80">
							This is your profile page. Update your settings, share a bit about
							yourself, and showcase your stories. Happy writing!
						</p>
					</div>
				)}

				{isYourProfile && !profileUser?.isLegacyMember && (
					<>
						<button
							type="button"
							onClick={() => backdropImageInputRef.current?.click()}
							disabled={updateUserBackdrop.isPending}
							className="absolute right-6 top-6 flex items-center gap-2 rounded-md bg-black/40 px-3 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:cursor-pointer hover:bg-black/60 disabled:cursor-wait disabled:opacity-70"
						>
							<FiCamera />
							{updateUserBackdrop.isPending ? "Uploading..." : "Change cover"}
						</button>
						<input
							ref={backdropImageInputRef}
							type="file"
							accept="image/*"
							className="sr-only"
							aria-label="Select a cover image"
							onChange={event => {
								const file = event.currentTarget.files?.[0];
								if (!file) return;

								const formData = new FormData();
								formData.append("backdrop-image", file);
								updateUserBackdrop.mutate(formData);
								event.currentTarget.value = "";
							}}
						/>
						{updateUserBackdrop.isError && (
							<p
								className="absolute right-6 top-16 rounded bg-black/60 px-3 py-2 text-sm text-white"
								role="alert"
							>
								Unable to upload the cover image. Please try again.
							</p>
						)}
					</>
				)}
			</div>

			{/* Content */}
			<div className="relative mx-auto -mt-20 grid max-w-6xl gap-6 px-6 pb-12 lg:grid-cols-[1fr_320px]">
				{/* Main column */}
				<div className="order-2 overflow-hidden rounded-lg border border-[#d6dcd5] bg-[#f3f4f0] shadow-lg shadow-[#29352b]/10 lg:order-1">
					{isYourProfile && profileUser?.isLegacyMember && (
						<div className="flex justify-end border-b border-[#d6dcd5] px-6 py-5">
							<p className="text-sm text-slate-600">
								Legacy members cannot edit their profile
							</p>
						</div>
					)}

					<div className="p-6">
						<h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
							About me
						</h3>
						{profileUser?.isLegacyMember ? (
							<div
								className="mt-3 max-w-3xl text-sm leading-7 text-gray-600"
								dangerouslySetInnerHTML={{
									__html: profileUser?.biography
								}}
							/>
						) : (
							<p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
								{profileUser?.biography}
							</p>
						)}
					</div>

					<div className="border-y border-[#d6dcd5] px-6">
						<div
							className="flex gap-6"
							role="tablist"
							aria-label="Profile sections"
						>
							<button
								type="button"
								role="tab"
								aria-selected={!isSettingsTabActive}
								onClick={() => setActiveTab("stories")}
								className={`border-b-2 px-1 py-3 text-sm font-semibold hover:cursor-pointer ${
									!isSettingsTabActive
										? "border-[#343a35] text-[#343a35]"
										: "border-transparent text-gray-500 hover:text-[#343a35]"
								}`}
							>
								Published Stories
							</button>
							{canManageSettings && (
								<button
									type="button"
									role="tab"
									aria-selected={isSettingsTabActive}
									onClick={() => setActiveTab("settings")}
									className={`border-b-2 px-1 py-3 text-sm font-semibold hover:cursor-pointer ${
										activeTab === "settings"
											? "border-[#343a35] text-[#343a35]"
											: "border-transparent text-gray-500 hover:text-[#343a35]"
									}`}
								>
									Settings
								</button>
							)}
						</div>
					</div>

					{!isSettingsTabActive ? (
						<div className="p-6" role="tabpanel">
							{getAllPublishedUserContent?.data?.length === 0 ? (
								<div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[#c9d1c8] bg-white/40 p-6 text-center">
									<FiBookOpen className="text-3xl text-gray-400" />
									<div>
										<h3 className="text-sm font-semibold">
											No published stories yet
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											Published stories will appear here.
										</p>
									</div>
								</div>
							) : (
								<div>
									{getAllPublishedUserContent?.data?.map((story, index) => (
										<Link to={`/genre/${story.genre}/${story.id}/read`}>
											<UserStoryCard
												key={index}
												title={story.title}
												genre={story.genre}
											/>
										</Link>
									))}
								</div>
							)}
						</div>
					) : (
						<div
							className="flex items-center flex-col justify-between p-6"
							role="tabpanel"
						>
							<SettingsForm />

							<div className="mt-4 overflow-hidden rounded-lg border border-red-800 bg-red-900/90">
								{/* Header */}
								<div className="border-b border-red-400/30 px-6 py-5">
									<h2 className="font-alike-angular text-xl font-semibold text-red-50">
										Danger Zone
									</h2>
									<p className="mt-1 text-sm leading-relaxed text-red-200">
										Manage irreversible actions associated with your account.
									</p>
								</div>

								{/* Delete Account */}
								<div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
									<div className="space-y-1">
										<h3 className="font-alike-angular text-base font-medium text-red-50">
											Delete Account
										</h3>
										{
											<p className="max-w-lg text-sm leading-relaxed text-red-200">
												Permanently delete your account and associated data.
												This action cannot be undone.
											</p>
										}
									</div>

									<button
										type="button"
										disabled={deleteAccount.isPending}
										onClick={() => {
											if (
												confirm(
													"Are you sure you want to delete your account? This action cannot be undone."
												)
											) {
												deleteAccount.mutate(undefined, {
													onSuccess: () => navigate("/", { replace: true })
												});
											}
										}}
										className="shrink-0 cursor-pointer rounded-md border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-800 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-wait disabled:opacity-70"
									>
										{deleteAccount.isPending ? "Deleting..." : "Delete Account"}
									</button>
								</div>
								{deleteAccount.isError && (
									<p className="px-6 pb-6 text-sm text-red-100" role="alert">
										Unable to delete your account. Please try again.
									</p>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Sidebar card */}
				<aside className="order-1 h-fit rounded-lg border border-[#d6dcd5] bg-[#f3f4f0] px-6 pb-6 shadow-lg shadow-[#29352b]/10 lg:order-2">
					<div className="group relative mx-auto -mt-16 h-32 w-32 overflow-hidden rounded-full border-4 border-novice-ink-yellow shadow-md">
						<img
							src={
								isYourProfile
									? `${profileUser?.profilePicture}?v=${profileUser?.updatedAt}`
									: `${profileUser?.profilePicture}`
							}
							alt="Profile"
							className="h-full w-full object-cover"
						/>
						{isYourProfile && !profileUser?.isLegacyMember && (
							<>
								<button
									type="button"
									onClick={() => profileImageInputRef.current?.click()}
									disabled={updateUserPfp.isPending}
									aria-label="Choose a profile image"
									className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-sm font-medium text-white opacity-0 transition-opacity hover:cursor-pointer hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 disabled:cursor-wait disabled:opacity-100"
								>
									<FiCamera className="text-xl" />
									<span>
										{updateUserPfp.isPending ? "Uploading..." : "Change photo"}
									</span>
								</button>
								<input
									ref={profileImageInputRef}
									type="file"
									accept="image/*"
									className="sr-only"
									aria-label="Select a profile image"
									onChange={event => {
										const file = event.currentTarget.files?.[0];
										if (!file) return;

										const formData = new FormData();
										formData.append("profile-picture", file);
										updateUserPfp.mutate(formData);
										event.currentTarget.value = "";
									}}
								/>
							</>
						)}
					</div>
					{updateUserPfp.isError && (
						<p className="mt-2 text-center text-sm text-red-700" role="alert">
							Unable to upload the profile photo. Please try again.
						</p>
					)}
					<h2 className="mt-4 text-center font-lusitana text-2xl font-bold">
						{profileUser?.firstName} {profileUser?.lastName}
					</h2>

					<ul className="mt-6 space-y-4 text-sm">
						{profileUser?.isLegacyMember && (
							<li className="flex items-start gap-3">
								<MdVerified className="mt-0.5 shrink-0 text-yellow-600" />
								<div>
									<p className="text-xs font-semibold uppercase tracking-widest text-yellow-600">
										{isYourProfile
											? "You are a legacy member"
											: "This user is a legacy member"}
									</p>
								</div>
							</li>
						)}
						<li className="flex items-start gap-3">
							<FiUser className="mt-0.5 shrink-0 text-gray-500" />
							<div>
								<p className="text-xs font-bold uppercase tracking-widest text-gray-500">
									Role
								</p>
								<p>
									{profileUser?.role
										?.split(" ")
										.map(word => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</p>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<FaUserGraduate className="mt-0.5 shrink-0 text-gray-500" />
							<div>
								<p className="text-xs font-bold uppercase tracking-widest text-gray-500">
									Grade
								</p>
								<p>
									{profileUser?.grade
										? profileUser?.grade.charAt(0).toUpperCase() +
											String(profileUser?.grade).slice(1)
										: "Not Specified"}
								</p>
							</div>
						</li>
						<li className="flex items-start gap-3">
							{profileUser?.gender === "male" ? (
								<IoMale className="mt-0.5 shrink-0 text-gray-500" />
							) : profileUser?.gender === "female" ? (
								<IoFemale className="mt-0.5 shrink-0 text-gray-500" />
							) : (
								<FiUser className="mt-0.5 shrink-0 text-gray-500" />
							)}
							<div>
								<p className="text-xs font-bold uppercase tracking-widest text-gray-500">
									Gender
								</p>
								<p>
									{profileUser?.gender
										? profileUser?.gender.charAt(0).toUpperCase() +
											profileUser?.gender.slice(1)
										: "Prefer Not to Say"}
								</p>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<FaRegCalendarAlt className="mt-0.5 shrink-0 text-gray-500" />
							<div>
								<p className="text-xs font-bold uppercase tracking-widest text-gray-500">
									Joined
								</p>
								<p>
									{profileUser?.createdAt &&
										new Date(profileUser?.createdAt).toLocaleDateString(
											undefined,
											{ year: "numeric", month: "long" }
										)}
								</p>
							</div>
						</li>
					</ul>
				</aside>
			</div>
		</div>
	);
}
