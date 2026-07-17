import { z } from "zod";

export const officerTaggingSchema = z.object({
  officer: z.string().min(1, "Officer is required"),
  services: z
    .array(z.string())
    .min(1, "At least one sub-service is required"),
  wards: z.string().min(1, "Wards are required").trim(),
});
