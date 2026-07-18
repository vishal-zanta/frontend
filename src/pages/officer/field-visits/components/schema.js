import { z } from "zod";

export const fieldVisitSchema = z.object({
  status: z.string().min(1, "Status is required"),
  schedule: z.string().optional(),
  remarks: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.status !== "CANCELLED" && (!data.schedule || !data.schedule.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Schedule date is required",
      path: ["schedule"],
    });
  }
  if (data.status === "COMPLETED" && (!data.remarks || !data.remarks.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Remarks are required when status is COMPLETED",
      path: ["remarks"],
    });
  }
});
