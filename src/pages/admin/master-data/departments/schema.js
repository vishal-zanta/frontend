import { z } from "zod";

export const departmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Department title (English) is required"),
  titleHindi: z
    .string()
    .trim()
    .min(1, "विभाग का नाम (Hindi) is required"),
});
