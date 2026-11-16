import { z } from "zod";
import { Grade } from "../enums/grade";
import { Gender } from "../enums/gender";

export const userSettingsSchema = z.object({
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	grade: z.enum(Grade).optional(),
	gender: z.enum(Gender).optional(),
	biography: z.string().min(1).max(500).optional()
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
