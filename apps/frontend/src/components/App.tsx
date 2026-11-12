import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavDisplay from "./middleware/NavDisplay";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import "../css/index.css";
import Navbar from "./Navbar";
import Auth from "../pages/Auth";
import ResetPassword from "../pages/ResetPassword";
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth.store";

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
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sign-in" element={<Auth />} />
				<Route path="/sign-up" element={<Auth />} />
				<Route path="/verify-email" element={<Auth />} />
				<Route path="/forgot-password" element={<Auth />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
