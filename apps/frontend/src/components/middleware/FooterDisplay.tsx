import { useLocation } from "react-router-dom";

export default function FooterDisplay({
	children
}: {
	children: React.ReactNode;
}) {
	const location = useLocation();
	const pagesToHideNav = [
		"/sign-up",
		"/sign-in",
		"/forgot-password",
		"/verify-email",
		"/reset-password"
	];

	const isAuthPage = pagesToHideNav.includes(location.pathname);

	return <>{!isAuthPage ? children : null}</>;
}
