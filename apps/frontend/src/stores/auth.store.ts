import { create } from "zustand";
import { api } from "../lib/api";
import type { User } from "@repo/shared-types";

interface AuthStore {
	user: User | null;
	isLoading: boolean;
	isInitialized: boolean;

	initialize: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	clearSession: () => void;
}

export const useAuthStore = create<AuthStore>(set => ({
	user: null,
	isLoading: false,
	isInitialized: false,

	initialize: async () => {
		set({ isLoading: true });

		try {
			const { data } = await api.get<User>("/api/auth/current-user");

			set({ user: data });
		} catch {
			set({ user: null });
		} finally {
			set({
				isLoading: false,
				isInitialized: true
			});
		}
	},

	login: async (email, password) => {
		await api.post("/api/auth/sign-in", {
			email,
			password
		});

		const { data } = await api.get<User>("/api/auth/current-user");

		set({ user: data });
	},

	logout: async () => {
		try {
			await api.post("/api/auth/sign-out");
		} finally {
			set({ user: null });
		}
	},

	clearSession: () => {
		set({ user: null });
	}
}));
