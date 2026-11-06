import { useLocation } from "react-router-dom";

export default function NavDisplay({
	children
}: {
	children: React.ReactNode;
}) {
	const location = useLocation();
	const isAuthPage =
		location.pathname === "/sign-in" || location.pathname === "/sign-up";

	return <>{!isAuthPage ? children : null}</>;
}
