import { z } from "zod";

const validationSchema = z.object({
    name: z
        .string()
        .nonempty("Citizen name is required")
        .max(100, "Max length allowed = 100"),
    mobileNo: z
        .string()
        .nonempty("Mobile number is required")
        .regex(
            /^[6-9]\d{9}$/,
            "Enter a valid 10-digit mobile number starting with 6-9",
        ),
    typeId: z
        .union([z.string(), z.number()])
        .refine((val) => val !== "" && val !== undefined && val !== null, {
            message: "Type is required",
        }),
    categoryId: z
        .union([z.string(), z.number()])
        .refine((val) => val !== "" && val !== undefined && val !== null, {
            message: "Category is required",
        }),
    stateId: z.union([z.string(), z.number()]).optional(),
    districtId: z
        .union([z.string(), z.number()])
        .refine((val) => val !== "" && val !== undefined && val !== null, {
            message: "District is required",
        }),
    blockId: z
        .union([z.string(), z.number()])
        .refine((val) => val !== "" && val !== undefined && val !== null, {
            message: "Block is required",
        }),
    panchayatId: z.union([z.string(), z.number()]).refine((val) => val !== "" && val !== undefined && val !== null, {
        message: "Panchayat is required",
    }),
    villageId: z.union([z.string(), z.number()]).optional(),
    address: z.string().min(1, "Address is required").max(300, "Max length allowed = 300"),
    grievancesDescription: z
        .string()
        .nonempty("Grievance description is required")
        .min(5, "Min 5 characters required")
        .max(1000, "Max length allowed = 1000"),
});

export default validationSchema;
