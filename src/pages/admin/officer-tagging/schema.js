import { z } from "zod";

export const officerTaggingSchema = z.object({
  officer: z.string().min(1, "Officer is required"),
  services: z
    .array(z.string())
    .min(1, "At least one service is required"),
  districts: z
    .array(z.string())
    .min(1, "At least one district is required"),
  areaType: z
    .array(z.string())
    .min(1, "At least one area type is required"),
  blocks: z.array(z.string()).default([]),
  panchayats: z.array(z.string()).default([]),
  urbanPanchayats: z.array(z.string()).default([]),
  wards: z.array(z.string()).default([]),
});

export const defaultOfficerTaggingValues = {
  officer: "",
  services: [],
  districts: [],
  areaType: [],
  blocks: [],
  panchayats: [],
  urbanPanchayats: [],
  wards: [],
};
