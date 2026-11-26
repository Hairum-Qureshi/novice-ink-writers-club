import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaPlus, FaMinus } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/auth.store";

interface MobileNavbarProps {
	onClose: () => void;
}

export default function MobileNavbar({ onClose }: MobileNavbarProps) {
	const { signOut } = useAuth();
	const navigate = useNavigate();
	const user = useAuthStore(state => state.user);
	const logout = useAuthStore(state => state.logout);

	const [isGenresOpen, setIsGenresOpen] = useState(false);
	const [isFictionOpen, setIsFictionOpen] = useState(false);

	const fictionGenres = [
		"Apocalyptic",
		"Dystopian",
		"Mystery",
		"Sci-Fi",
		"Fantasy"
	];

	const navigationLinks = [
		{ label: "All Users", to: "/all-users" },
		{ label: "Profile", to: `/user/${user?.id}/profile` },
		{ label: "Club Members", to: "/club-members" },
		{ label: "Magazine Issues", to: "/magazine-issues" },
		{ label: "Contact Us", to: "/contact-us" }
	];

	const linkClass =
		"block px-4 py-3 rounded-sm hover:bg-white/5 hover:text-novice-ink-yellow transition-colors";

	return (
		<div
			id="mobile-navigation"
			className="absolute top-full left-0 z-50 w-full
			max-h-[calc(100dvh-5rem)] overflow-y-auto
			bg-[#1b1b1b] border-b-2 border-novice-ink-yellow
			shadow-xl lg:hidden"
		>
			<ul className="flex flex-col px-4 py-4 text-xl text-white font-lusitana">
				{!user ? (
					<>
						<li>
							<Link to="/sign-in" onClick={onClose} className={linkClass}>
								Sign In
							</Link>
						</li>
						<li>
							<Link to="/sign-up" onClick={onClose} className={linkClass}>
								Sign Up
							</Link>
						</li>
					</>
				) : (
					<>
						{/* Genres dropdown */}
						<li>
							<button
								type="button"
								aria-expanded={isGenresOpen}
								onClick={() => setIsGenresOpen(prev => !prev)}
								className={`flex w-full items-center justify-between
									px-4 py-3 cursor-pointer
									hover:text-novice-ink-yellow
									${isGenresOpen ? "text-novice-ink-yellow" : ""}`}
							>
								Genres
								<FaChevronDown
									className={`text-sm transition-transform duration-200
										${isGenresOpen ? "rotate-180" : ""}`}
								/>
							</button>

							{isGenresOpen && (
								<ul className="ml-6 pl-3 border-l border-white/20 text-lg">
									<li>
										<Link
											to="/genre/poetry"
											onClick={onClose}
											className={linkClass}
										>
											Poetry
										</Link>
									</li>

									<li>
										<Link
											to="/genre/essays"
											onClick={onClose}
											className={linkClass}
										>
											Essays
										</Link>
									</li>

									{/* Fiction dropdown */}
									<li>
										<button
											type="button"
											aria-expanded={isFictionOpen}
											onClick={() => setIsFictionOpen(prev => !prev)}
											className="flex w-full items-center justify-between
											px-4 py-3 cursor-pointer
											hover:text-novice-ink-yellow"
										>
											Fiction
											{isFictionOpen ? (
												<FaMinus className="text-xs" />
											) : (
												<FaPlus className="text-xs" />
											)}
										</button>

										{isFictionOpen && (
											<ul className="ml-6 pl-3 border-l border-white/20 text-base">
												{fictionGenres.map(genre => (
													<li key={genre}>
														<Link
															to={`/fiction/${genre.toLowerCase()}`}
															onClick={onClose}
															className={linkClass}
														>
															{genre}
														</Link>
													</li>
												))}
											</ul>
										)}
									</li>
								</ul>
							)}
						</li>

						{/* Navigation links */}
						{navigationLinks.map(({ label, to }) => (
							<li key={to}>
								<Link to={to} onClick={onClose} className={linkClass}>
									{label}
								</Link>
							</li>
						))}

						{/* Sign out */}
						<li className="mt-3 pt-3 border-t border-white/15">
							<button
								type="button"
								disabled={signOut.isPending}
								className="w-full px-4 py-3 text-left
								text-novice-ink-yellow cursor-pointer
								hover:bg-white/5 disabled:opacity-50
								disabled:cursor-not-allowed"
								onClick={() => {
									logout();
									signOut.mutate({
										onSuccess: () => {
											onClose();
											navigate("/");
										}
									});
								}}
							>
								{signOut.isPending ? "Signing Out..." : "Sign Out"}
							</button>
						</li>
					</>
				)}
			</ul>
		</div>
	);
}
