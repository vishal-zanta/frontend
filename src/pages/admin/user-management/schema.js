import { z } from "zod";

const baseObject = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  role: z.string().min(1, "Role is required"),
  district: z.string(),
  // .min(1, "District is required"),
  status: z.string().optional(),
  skills: z.array(z.string()).optional(),
  preferredLanguages: z.array(z.string()).optional(),
});

const addObject = baseObject.extend({
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
});

const editObject = baseObject.extend({
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export const addSchema = addObject.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

export const editSchema = editObject.refine(
  (data) => {
    if (!data.password && !data.confirmPassword) return true;
    return data.password === data.confirmPassword;
  },
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);
