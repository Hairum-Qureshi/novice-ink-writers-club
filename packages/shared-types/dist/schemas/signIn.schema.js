import { z } from "zod";
export const signInSchema = z.object({
    email: z.email().toLowerCase(),
    password: z.string().min(8)
});
