import { z } from "zod";

export const workflowSchema = z.object({
  role: z.string().min(1, "Role is required"),
  description: z.string().optional().default(""),
});
