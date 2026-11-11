import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavDisplay from "./middleware/NavDisplay";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import "../css/index.css";
import Navbar from "./Navbar";
import Auth from "../pages/Auth";
import ResetPassword from "../pages/ResetPassword";

export default function App() {
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
