import { z } from "zod";

export const workflowSchema = z.object({
  role: z.string().min(1, "Designation is required"),
  description: z.string().optional().default(""),
});
