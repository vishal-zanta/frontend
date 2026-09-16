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

const locationOrPermanentAddress = z.object({
  isUrban: z.boolean().default(false),
  addressLine: z
    .string()
    .min(1, "Field is required")
    .max(50, "Address details cannot exceed 50 characters"),
  district: z
    .string()
    .min(1, "Field is required")
    .max(50, "District cannot exceed 50 characters"),

  // Rural
  block: z
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
  village: z
    .string()
    .max(50, "Village cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  pincode: z.string().min(1, "Pincode is required").regex(/^$|^8\d{5}$/, "Enter a valid pin code of Bihar"),

  // Urban
  urbanPanchayat: z
    .string()
    .max(
      50,
      "Municipal corporation/municipal council/nagar panchayat cannot exceed 50 characters",
    )
    .optional()
    .or(z.literal("")),
  ward: z
    .string()
    .max(50, "Ward cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),

  // Common
  landmark: z
    .string()
    .max(50, "Landmark cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
});

const finalAddressSchema = z.object({
  isUrban: z.boolean().default(false),
  addressLine: z
    .string()
    .max(50, "Address details cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  district: z
    .string()
    .max(50, "District cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  block: z
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
  village: z
    .string()
    .max(50, "Village cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .max(6, "Pincode cannot exceed 6 characters"),

  // Urban
  urbanPanchayat: z
    .string()
    .max(
      50,
      "Municipal corporation/municipal council/nagar panchayat cannot exceed 50 characters",
    )
    .optional()
    .or(z.literal("")),
  ward: z
    .string()
    .max(50, "Ward cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),

  // Correspondence
  state: z
    .string()
    .max(50, "State cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(50, "City cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  addressLine2: z
    .string()
    .max(50, "Address details cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  landmark: z
    .string()
    .max(50, "Landmark cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
});

const addressSchema = locationOrPermanentAddress.superRefine((data, ctx) => {
  if (!!data.isUrban) {
    const requiredKeys = ["urbanPanchayat", "ward"];
    requiredKeys.forEach((key) => {
      if (!data[key] || data[key].trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Field is required",
          path: [key],
        });
      }
    });
  } else {
    const requiredKeys = ["block", "panchayat"];
    requiredKeys.forEach((key) => {
      if (!data[key] || data[key].trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Field is required",
          path: [key],
        });
      }
    });
  }
});

const correspondenceAddressSchema = finalAddressSchema.superRefine(
  (data, ctx) => {
    if (!data.state || data.state.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Field is required",
        path: ["state"],
      });
    }

    if (data.state === "Bihar") {
      // standard Bihar address handling
    } else {
      const requiredKeys = ["addressLine", "city"];
      requiredKeys.forEach((key) => {
        if (!data[key] || data[key].trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Field is required",
            path: [key],
          });
        }
      });
    }
  },
);

export const grievanceSchema = z.object({
  channel: z.string().min(1, "Channel is required"),
  citizenInfo: z.object({
    fullName: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name cannot exceed 50 characters"),
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
    address: addressSchema,
  }),
  classification: z.object({
    department: z.string().min(1, "Department is required"),
    service: z.string().min(1, "Service/Category is required"),
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
  location: addressSchema,
});

export const defaultValues = {
  channel: "",
  citizenInfo: {
    fullName: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    address: {
      isUrban: false,
      addressLine: "",
      district: "",
      panchayat: "",
      pincode: "",
      block: "",
      thana: "",
      village: "",
      urbanPanchayat: "",
      ward: "",
      landmark: "",
    },
  },
  classification: {
    department: "",
    service: "",
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
    isUrban: false,
    state: "Bihar",
    city: "",
    addressLine: "",
    district: "",
    panchayat: "",
    pincode: "",
    block: "",
    thana: "",
    village: "",
    urbanPanchayat: "",
    ward: "",
    addressLine2: "",
    landmark: "",
  },
  location: {
    isUrban: false,
    addressLine: "",
    district: "",
    panchayat: "",
    pincode: "",
    block: "",
    thana: "",
    village: "",
    urbanPanchayat: "",
    ward: "",
    landmark: "",
  },
};
