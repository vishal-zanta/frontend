import { z } from "zod";

export const PREFERRED_LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिन्दी (Hindi)" },
];

export const CHANNEL_OPTIONS = [
  { value: "Website", label: "Website" },
  { value: "Call", label: "Call" },
  { value: "Whatsapp", label: "Whatsapp" },
];

const addressSchema = z.object({
  addressLine: z
    .string()
    .min(1, "Address details are required")
    .max(50, "Address details cannot exceed 50 characters"),
  district: z
    .string()
    .min(1, "District is required")
    .max(50, "District cannot exceed 50 characters"),
  subdivision: z
    .string()
    .min(1, "Block is required")
    .max(50, "Block cannot exceed 50 characters"),
  panchayat: z
    .string()
    .min(1, "Panchayat is required")
    .max(50, "Panchayat cannot exceed 50 characters"),
  thana: z.string()
    .min(1, "Thana is required")
    .max(50, "Thana cannot exceed 50 characters"),
  pincode: z.string().min(1, "Pincode is required"),
});

const correspondenceAddressSchema = z
  .object({
    addressLine: z
      .string()
      .min(1, "Address details are required")
      .max(50, "Address details cannot exceed 50 characters"),
    state: z
      .string()
      .min(1, "State is required")
      .max(50, "State cannot exceed 50 characters"),
    city: z
      .string()
      .max(50, "City cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
    district: z
      .string()
      .max(50, "District cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
    subdivision: z
      .string()
      .max(50, "Block cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
    panchayat: z
      .string()
      .max(50, "Panchayat cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
    thana: z
      .string()
      .max(50, "Thana cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
    pincode: z.string().min(1, "Pincode is required"),
  })
  .superRefine((data, ctx) => {
    if (data.state === "Bihar") {
      if (!data.district || data.district.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "District is required",
          path: ["district"],
        });
      }
      if (!data.subdivision || data.subdivision.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Block is required",
          path: ["subdivision"],
        });
      }
      if (!data.panchayat || data.panchayat.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Panchayat is required",
          path: ["panchayat"],
        });
      }
      if (!data.thana || data.thana.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Thana is required",
          path: ["thana"],
        });
      }
    } else {
      if (!data.city || data.city.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required",
          path: ["city"],
        });
      }
    }
  });

export const grievanceSchema = z.object({
  channel: z.string().min(1, "Channel is required"),
  citizenInfo: z.object({
    fullName: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name cannot exceed 50 characters"),
      // .optional()
      // .or(z.literal("")),
    mobile: z
      .string()
      .min(10, "Mobile number must be at least 10 digits"),
    alternateMobile: z
      .string()
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email("Enter a valid email")
      .max(50, "Email cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
    // preferredLanguage: z.string().min(1, "Preferred language is required"),
    address: addressSchema,
  }),
  classification: z.object({
    department:  z.string().min(1, "Department is required"),
    service:  z.string().min(1, "Service/Category is required"),
    // subService: z.string().min(1, "Sub-service is required"),
    nature: z.string().min(1, "Grievance type is required"),
    isSeasonal: z.boolean().optional(),
    seasonalType: z
      .string()
      .max(50, "Seasonal type cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
  }),
  evidence: z.object({
    details: z
      .string()
      .min(1, "Brief description is required")
      .max(1000, "Brief description cannot exceed 1000 characters"),
  }),
  impact: z.object({
    affectedBeneficiary: z.string().min(1, "Affected beneficiary is required"),
    vulnerability: z.object({
      seniorCitizen: z.boolean().optional(),
      woman: z.boolean().optional(),
      personWithDisability: z.boolean().optional(),
      economicallyWeakerSection: z.boolean().optional(),
    }),
  }),
  communication: z.object({
    feedbackConsent: z.boolean().optional(),
  }),
  isCrpEqualPerAdd: z.boolean().optional(),
  address: correspondenceAddressSchema,
  location: z.object({
    division: z
      .string()
      .min(1, "Division is required")
      .max(50, "Division cannot exceed 50 characters"),
    district: z
      .string()
      .min(1, "District is required")
      .max(50, "District cannot exceed 50 characters"),
    subdivision: z
      .string()
      .min(1, "Block is required")
      .max(50, "Block cannot exceed 50 characters"),
    block: z
      .string()
      .min(1, "Block is required")
      .max(50, "Block cannot exceed 50 characters"),
    panchayat: z
      .string()
      .min(1, "Panchayat is required")
      .max(50, "Panchayat cannot exceed 50 characters"),
    pincode: z
      .string()
      .min(1, "Pincode is required")
      .regex(/^8\d{5}$/, "Enter a valid pin code of Bihar"),
  }),
});

export const defaultValues = {
  channel: "",
  citizenInfo: {
    fullName: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    // preferredLanguage: "",
    address: {
      addressLine: "",
      district: "",
      panchayat: "",
      pincode: "",
      subdivision: "",
      thana: "",
    },
  },
  classification: {
    department: "",
    service: "",
    // subService: "",
    nature: "",
    isSeasonal: false,
    seasonalType: "",
  },
  evidence: { details: "" },
  impact: {
    affectedBeneficiary: "",
    vulnerability: {
      seniorCitizen: false,
      woman: false,
      personWithDisability: false,
      economicallyWeakerSection: false,
    },
  },
  communication: {
    feedbackConsent: false,
  },
  isCrpEqualPerAdd: false,
  address: {
    addressLine: "",
    district: "",
    panchayat: "",
    pincode: "",
    subdivision: "",
    thana: "",
    state: "Bihar",
    city: "",
  },
  location: {
    division: "",
    district: "",
    subdivision: "",
    block: "",
    panchayat: "",
    pincode: "",
  },
};
