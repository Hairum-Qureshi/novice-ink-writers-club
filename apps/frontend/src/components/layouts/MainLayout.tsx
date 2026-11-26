import { Outlet } from "react-router-dom";
import NavDisplay from "../middleware/NavDisplay";
import Navbar from "../Navbar";
import FooterDisplay from "../middleware/FooterDisplay";
import Footer from "../Footer";

export default function MainLayout() {
	return (
		<>
			<NavDisplay>
				<Navbar />
			</NavDisplay>
			<Outlet />
			<FooterDisplay>
				<Footer />
			</FooterDisplay>
		</>
	);
}
