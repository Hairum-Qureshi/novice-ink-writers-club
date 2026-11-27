import axios from "axios";

export function getAuthErrorMessage(
	error: unknown,
	fallback: string,
	unauthorizedMessage?: string
): string {
	if (!axios.isAxiosError<{ message?: unknown }>(error)) return fallback;

	const message = error.response?.data?.message;

	if (
		error.response?.status === 401 &&
		error.config?.url === "/api/auth/sign-in" &&
		message === "Unauthorized" &&
		unauthorizedMessage
	) {
		return unauthorizedMessage;
	}

	if (typeof message === "string" && message.trim()) return message;
	if (Array.isArray(message) && message.every(item => typeof item === "string")) {
		const messages = message.filter(item => item.trim());
		if (messages.length) return messages.join(", ");
	}

	return fallback;
}
