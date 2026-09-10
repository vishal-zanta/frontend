import { z } from "zod";

export const officerTaggingSchema = z.object({
  officer: z.string().min(1, "Officer is required"),
  services: z
    .array(z.string())
    .min(1, "At least one service is required"),
  divisions: z
    .array(z.string())
    .min(1, "At least one division is required"),
  subdivisions: z
    .array(z.string())
    .min(1, "At least one subdivision is required"),
});
