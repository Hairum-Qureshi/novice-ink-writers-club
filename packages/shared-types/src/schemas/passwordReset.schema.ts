import { z } from "zod";

export const passwordResetSchema = z
	.object({
		newPassword: z.string().min(8),
		confirmedNewPassword: z.string().min(8)
	})
	.refine(data => data.newPassword === data.confirmedNewPassword, {
		message: "Passwords do not match",
		path: ["confirmedNewPassword"]
	});

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
