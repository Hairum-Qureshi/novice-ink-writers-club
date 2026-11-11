import { useLocation } from "react-router-dom";

export default function NavDisplay({
	children
}: {
	children: React.ReactNode;
}) {
	const location = useLocation();
	const pagesToHideNav = [
		"/sign-in",
		"/sign-up",
		"/forgot-password",
		"/verify-email",
		"/reset-password"
	];

	const isAuthPage = pagesToHideNav.includes(location.pathname);

	return <>{!isAuthPage ? children : null}</>;
}
