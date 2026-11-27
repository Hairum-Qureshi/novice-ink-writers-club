import { z } from "zod";
export declare const passwordResetSchema: z.ZodObject<{
    newPassword: z.ZodString;
    confirmedNewPassword: z.ZodString;
}, z.core.$strip>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
