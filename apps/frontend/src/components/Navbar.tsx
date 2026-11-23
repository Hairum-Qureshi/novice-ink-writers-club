import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useAuthStore } from "../stores/auth.store";
import { FaChevronDown } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

export default function Navbar() {
	const { signOut } = useAuth();
	const navigate = useNavigate();
	const user = useAuthStore(state => state.user);
	const logout = useAuthStore(state => state.logout);

	return (
		<nav className="bg-[#1b1b1b] h-20 p-4 border-b-2 border-y-novice-ink-yellow flex justify-between items-center">
			<div className="mx-6 text-4xl text-novice-ink-yellow font-dancing-script">
				<Link to="/">Novice Ink.</Link>
			</div>
			<div className="mx-6">
				<ul className="flex space-x-6 text-white text-xl font-lusitana">
					{!user && (
						<>
							<Link to="sign-in" className="hover:text-novice-ink-yellow">
								<li>Sign In</li>
							</Link>
							<Link to="sign-up" className="hover:text-novice-ink-yellow">
								<li>Sign Up</li>
							</Link>
						</>
					)}
					{user && (
						<>
							<li className="group relative list-none">
								<Link
									to="#"
									className="flex items-center hover:text-novice-ink-yellow"
									aria-haspopup="true"
								>
									Genres
									<FaChevronDown className="ml-2 inline text-base" />
								</Link>
								<ul className="absolute left-0 top-full z-10 hidden min-w-40 rounded bg-[#1b1b1b] text-white shadow-lg group-hover:block group-focus-within:block">
									<li>
										<Link
											to="/genre/poetry"
											className="block px-4 py-2 hover:text-novice-ink-yellow"
										>
											Poetry
										</Link>
									</li>
									<li>
										<Link
											to="/genre/essays"
											className="block px-4 py-2 hover:text-novice-ink-yellow"
										>
											Essays
										</Link>
									</li>
									<li className="group/fiction relative">
										<p className="flex items-center justify-between px-4 py-2 hover:text-novice-ink-yellow">
											Fiction
											<FaPlus className="ml-2 inline text-base" />
										</p>
										<ul className="absolute left-full top-0 hidden min-w-40 rounded bg-[#1b1b1b] text-white shadow-lg group-hover/fiction:block group-focus-within/fiction:block">
											{[
												"Apocalyptic",
												"Dystopian",
												"Mystery",
												"Sci-Fi",
												"Fantasy"
											].map(genre => (
												<li key={genre}>
													<Link
														to={`/fiction/${genre.toLowerCase()}`}
														className="block px-4 py-2 hover:text-novice-ink-yellow"
													>
														{genre}
													</Link>
												</li>
											))}
										</ul>
									</li>
								</ul>
							</li>
							<Link to="/all-users" className="hover:text-novice-ink-yellow">
								<li>All Users</li>
							</Link>
							<Link
								to={`/user/${user?.id}/profile`}
								className="hover:text-novice-ink-yellow"
							>
								<li>Profile</li>
							</Link>
							<Link to="/club-members" className="hover:text-novice-ink-yellow">
								<li>Club Members</li>
							</Link>
							<Link to="/contact-us" className="hover:text-novice-ink-yellow">
								<li>Contact Us</li>
							</Link>
							<button
								disabled={signOut.isPending}
								className="hover:cursor-pointer"
								onClick={() => {
									logout();
									signOut.mutate({ onSuccess: () => navigate("/") });
								}}
							>
								Sign Out
							</button>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
}
