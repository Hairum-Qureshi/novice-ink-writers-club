import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true
});

const refreshClient = axios.create({
	baseURL: BASE_URL,
	withCredentials: true
});

let refreshPromise: Promise<void> | null = null;

function refreshSession() {
	if (!refreshPromise) {
		refreshPromise = refreshClient
			.post("/api/auth/refresh")
			.then(() => undefined)
			.finally(() => {
				refreshPromise = null;
			});
	}

	return refreshPromise;
}

api.interceptors.response.use(
	response => response,

	async error => {
		const originalRequest = error.config;

		if (
			error.response?.status !== 401 ||
			!originalRequest ||
			originalRequest._retry ||
			originalRequest.url === "/api/auth/refresh"
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		try {
			await refreshSession();

			return api(originalRequest);
		} catch {
			return Promise.reject(error);
		}
	}
);
