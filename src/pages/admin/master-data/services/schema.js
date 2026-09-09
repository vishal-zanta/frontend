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
  sla: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && !isNaN(Number(val)) && Number(val) > 0, {
      message: "SLA Duration is required and must be greater than 0",
    }),
  slaType: z.string().optional().default("hrs"),
  geoTagged: z.boolean().optional().default(false),
  fieldVisit: z.boolean().optional().default(false),
});
