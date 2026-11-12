import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useAuthStore } from "../stores/auth.store";

export default function Navbar() {
	const { signOut } = useAuth();
	const navigate = useNavigate();
	const user = useAuthStore(state => state.user);
	const logout = useAuthStore(state => state.logout);

	return (
		<nav className="bg-[#1b1b1b] p-4 border-b-2 border-y-novice-ink-yellow flex justify-between items-center">
			<div className="mx-6 text-4xl text-novice-ink-yellow font-dancing-script">
				Novice Ink.
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
							<Link to="/genres" className="hover:text-novice-ink-yellow">
								<li>Genres</li>
							</Link>
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
