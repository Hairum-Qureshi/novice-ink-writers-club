import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className="bg-[#1b1b1b] p-4 border-b-2 border-y-novice-ink-yellow flex justify-between items-center">
			<div className="mx-6 text-4xl text-novice-ink-yellow font-dancing-script">
				Novice Ink.
			</div>
			<div className="mx-6">
				<ul className="flex space-x-6 text-white text-xl font-lusitana">
					<Link to="sign-in" className="hover:text-novice-ink-yellow">
						<li>Sign In</li>
					</Link>
					<Link to="sign-up" className="hover:text-novice-ink-yellow">
						<li>Sign Up</li>
					</Link>
				</ul>
			</div>
		</nav>
	);
}
