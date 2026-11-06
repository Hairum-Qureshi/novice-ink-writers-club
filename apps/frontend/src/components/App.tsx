import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavDisplay from "./middleware/NavDisplay";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import "../css/index.css";
import Navbar from "./Navbar";
import Auth from "../pages/Auth";

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
				<Route path="/forgot-password" element={<Auth />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
