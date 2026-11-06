import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavDisplay from "./middleware/NavDisplay";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import "../css/index.css";
import Navbar from "./Navbar";

export default function App() {
	return (
		<BrowserRouter>
			<NavDisplay>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</NavDisplay>
		</BrowserRouter>
	);
}
