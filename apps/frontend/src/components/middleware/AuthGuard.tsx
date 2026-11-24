import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export default function AuthGuard() {
	const currentUser = useAuthStore(state => state.user);
	const isInitialized = useAuthStore(state => state.isInitialized);

	if (!isInitialized) return null;	
	if (!currentUser) return <Navigate to="/" replace />;

	return <Outlet />;
}
