import { z } from "zod";

export const grievanceNatureSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"),

  type: z
    .string({ required_error: "Type is required" })
    .min(1, "Type is required"),
});

export const grievanceNatureDefaultValues = {
  title: "",
  type: "",
};
