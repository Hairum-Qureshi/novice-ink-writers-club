import { useLocation } from "react-router-dom";

export default function NavDisplay({
	children
}: {
	children: React.ReactNode;
}) {
	const location = useLocation();
	const isAuthPage =
		location.pathname === "/sign-in" ||
		location.pathname === "/sign-up" ||
		location.pathname === "/forgot-password" ||
		location.pathname === "/verify-email";

	return <>{!isAuthPage ? children : null}</>;
}
