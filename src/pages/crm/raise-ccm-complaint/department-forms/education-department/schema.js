import { z } from "zod";
// let obj = {
//   externalRef: "UCH-2026-0001234",
//   type: "COMPLAINT",
//   categoryId: 112,
//   categoryOther: "string",
//   complaint:
//     "The school has been closed for the last four days without notice.",
//   complainant: {
//     name: "Ramesh Kumar",
//     mobile: "9876543210",
//     shareNumberWithOfficer: false,
//   },
//   location: {
//     districtCode: 1007,
//     blockCode: 0,
//     clusterCode: 0,
//     panchayatCode: 0,
//     villageCode: 0,
//     schoolCode: 0,
//     teacherCode: 0,
//   },
//   accused: {
//     name: "string",
//     designation: "string",
//   },
//   source: "HELPLINE",
//   registeredAt: "2026-08-18T11:02:00+05:30",
// };

const validationSchema = z.object({
  type: z.string().nonempty("Type is required"),
  categoryId: z.number({
    invalid_type_error: "Category is required",
    required_error: "Category is required",
  }),

  categoryOther: z.string().max(100, "Max length allowed = 100").optional(),
  source: z.string(),
  registeredAt: z.string(),
  complaint: z
    .string()
    .nonempty("Complaint Details are required")
    .min(10, "Min 10 characters required")
    .max(1000, "Max length allowed = 1000"),
  complainant: z.object({
    name: z
      .string()
      .nonempty("Complainant name is required")
      .max(100, "Max length allowed = 100"),
    mobile: z
      .string()
      .nonempty("Mobile is required")
      .regex(
        /^[6-9]\d{9}$/,
        "Enter a valid 10-digit mobile number starting with 6-9",
      ),
    shareNumberWithOfficer: z.boolean(),
  }),
  location: z.object({
    districtCode: z
      .union([z.string(), z.number()])
      .refine((value) => value !== "", {
        message: "District is required",
      }),
    blockCode: z.union([z.string(), z.number()]),
    clusterCode: z.union([z.string(), z.number()]),
    panchayatCode: z.union([z.string(), z.number()]),
    villageCode: z.union([z.string(), z.number()]),
    schoolCode: z.union([z.string(), z.number()]),
    teacherCode: z.union([z.string(), z.number()]),
  }),
  accused: z.object({
    name: z.string().max(100, "Max length allowed = 100").optional(),
    designation: z.string().max(100, "Max length allowed = 100").optional(),
  }),
});

export default validationSchema;
