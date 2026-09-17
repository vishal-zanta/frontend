import { z } from "zod";

export const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required").trim(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password.trim() !== "") {
      if (!data.confirmPassword || data.confirmPassword.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Confirm password is required",
          path: ["confirmPassword"],
        });
      } else if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    }
  });
