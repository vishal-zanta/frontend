import { z } from "zod";
import { CCE_ROLES } from "@/utils/constants";

export const getAddSchema = (rolesList) => {
  return z.object({
    name: z.string().min(1, "Name is required").trim(),
    role: z.string().min(1, "Role is required"),
    district: z.string().optional(),
    status: z.string().optional(),
    skills: z.array(z.string()).optional(),
    preferredLanguages: z.array(z.string()).optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  }).superRefine((data, ctx) => {
    // 1. Password mismatch check
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    // 2. Role-based checks
    const selectedRole = rolesList.find(r => r._id === data.role);
    const roleName = selectedRole?.designationEnglish || "";
    const isCCE = CCE_ROLES.includes(roleName);

    if (isCCE) {
      // For CCE, email and phone are optional, but if provided must be valid
      if (data.email && data.email.trim() !== "") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid email address",
            path: ["email"],
          });
        }
      }
      if (data.phone && data.phone.trim() !== "") {
        if (!/^\d{10}$/.test(data.phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Phone number must be 10 digits",
            path: ["phone"],
          });
        }
      }
    } else {
      // Validate Email as required
      if (!data.email || data.email.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
          path: ["email"],
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
          path: ["email"],
        });
      }

      // Validate Phone as required
      if (!data.phone || data.phone.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required",
          path: ["phone"],
        });
      } else if (!/^\d{10}$/.test(data.phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be 10 digits",
          path: ["phone"],
        });
      }
    }
  });
};

export const getEditSchema = (rolesList) => {
  return z.object({
    name: z.string().min(1, "Name is required").trim(),
    role: z.string().min(1, "Role is required"),
    district: z.string().optional(),
    status: z.string().optional(),
    skills: z.array(z.string()).optional(),
    preferredLanguages: z.array(z.string()).optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  }).superRefine((data, ctx) => {
    // 1. Password mismatch check
    if ((data.password || data.confirmPassword) && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    // 2. Role-based checks
    const selectedRole = rolesList.find(r => r._id === data.role);
    const roleName = selectedRole?.designationEnglish || "";
    const isCCE = CCE_ROLES.includes(roleName);

    if (isCCE) {
      // For CCE, email and phone are optional, but if provided must be valid
      if (data.email && data.email.trim() !== "") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid email address",
            path: ["email"],
          });
        }
      }
      if (data.phone && data.phone.trim() !== "") {
        if (!/^\d{10}$/.test(data.phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Phone number must be 10 digits",
            path: ["phone"],
          });
        }
      }
    } else {
      // Validate Email as required
      if (!data.email || data.email.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
          path: ["email"],
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
          path: ["email"],
        });
      }

      // Validate Phone as required
      if (!data.phone || data.phone.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required",
          path: ["phone"],
        });
      } else if (!/^\d{10}$/.test(data.phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be 10 digits",
          path: ["phone"],
        });
      }
    }
  });
};
