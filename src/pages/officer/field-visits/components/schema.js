import { z } from "zod";

export const fieldVisitSchema = z.object({
  status: z.string().min(1, "Status is required"),
  schedule: z.string().min(1, "Schedule date is required"),
  remarks: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.status === "COMPLETED" && (!data.remarks || !data.remarks.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Remarks are required when status is COMPLETED",
      path: ["remarks"],
    });
  }
});
