import { z } from "zod";
export declare const userSettingsSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    grade: z.ZodOptional<z.ZodEnum<{
        readonly FRESHMAN: "freshman";
        readonly SOPHOMORE: "sophomore";
        readonly JUNIOR: "junior";
        readonly SENIOR: "senior";
        readonly PREFER_NOT_TO_SAY: "prefer not to say";
    }>>;
    gender: z.ZodOptional<z.ZodEnum<{
        readonly MALE: "male";
        readonly FEMALE: "female";
        readonly PREFER_NOT_TO_SAY: "prefer not to say";
    }>>;
    biography: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
