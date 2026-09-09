import { z } from "zod";

export const officerTaggingSchema = z.object({
  officer: z.string().min(1, "Officer is required"),
  services: z
    .array(z.string())
    .min(1, "At least one service is required"),
  district: z.string().min(1, "District is required"),
  wards: z
    .array(z.string())
    .min(1, "At least one subdivision is required"),
});
