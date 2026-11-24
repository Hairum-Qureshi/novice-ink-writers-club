import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllUsers from "../pages/AllUsers";
import NavDisplay from "./middleware/NavDisplay";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import "../css/index.css";
import Navbar from "./Navbar";
import Auth from "../pages/Auth";
import ResetPassword from "../pages/ResetPassword";
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth.store";
import Profile from "../pages/Profile";
import ClubMembers from "../pages/ClubMembers";
import Contact from "../pages/Contact";
import Footer from "./Footer";
import Genre from "../pages/Genre";
import Read from "../pages/Read";
import AuthGuard from "./middleware/AuthGuard";

export default function App() {
	const initialize = useAuthStore(state => state.initialize);

	useEffect(() => {
		void initialize();
	}, [initialize]);

	return (
		<BrowserRouter>
			<NavDisplay>
				<Navbar />
			</NavDisplay>
			<main className="flex flex-1 flex-col">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/sign-in" element={<Auth />} />
					<Route path="/sign-up" element={<Auth />} />
					<Route path="/verify-email" element={<Auth />} />
					<Route path="/forgot-password" element={<Auth />} />
					<Route element={<AuthGuard />}>
						<Route path="/user/:userId/profile" element={<Profile />} />
						<Route path="/all-users" element={<AllUsers />} />
						<Route path="/club-members" element={<ClubMembers />} />
						<Route path="/contact-us" element={<Contact />} />
						<Route path="/genre/:genre" element={<Genre />} />
						<Route path="/genre/:genre/:storyId/read" element={<Read />} />
						<Route path="/fiction/:genre" element={<Genre />} />
					</Route>
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
				<Footer />
			</main>
		</BrowserRouter>
	);
}
