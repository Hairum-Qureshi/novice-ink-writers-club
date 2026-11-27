import { z } from "zod";
export declare const signInSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type SignInFormData = z.infer<typeof signInSchema>;
