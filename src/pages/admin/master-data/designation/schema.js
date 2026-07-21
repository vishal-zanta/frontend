import { z } from "zod";

export const designationSchema = z.object({
  designationEnglish: z
    .string()
    .trim()
    .min(1, "Designation (English) is required"),
  designationHindi: z
    .string()
    .trim()
    .min(1, "पदनाम (Hindi) is required"),
  level: z
    .string()
    .min(1, "Level is required"),
  permissions: z
    .array(z.string())
    .min(1, "At least one permission is required"),
  department: z
    .string()
    .min(1, "Department is required"),
});
