import { z } from "zod";

export const serviceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Service name (English) is required"),
  titleHindi: z
    .string()
    .trim()
    .min(1, "सेवा का नाम (Hindi) is required"),
  department: z
    .string()
    .min(1, "Department is required"),
});
