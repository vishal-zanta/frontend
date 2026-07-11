import { z } from "zod";

export const PREFERRED_LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिन्दी (Hindi)" },
];

export const grievanceSchema = z.object({
  citizenInfo: z.object({
    fullName: z.string().optional(),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    alternateMobile: z.string().optional(),
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
    preferredLanguage: z.string().optional(),
  }),
  classification: z.object({
    subService: z.string().min(1, "Sub-service is required"),
    nature: z.string().min(1, "Grievance type is required"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
  }),
  evidence: z.object({
    details: z.string().optional(),
    occurrenceDate: z.string().optional(),
    frequency: z.string().min(1, "Frequency is required"),
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
    satisfactionSurveyConsent: z.boolean().optional(),
  }),
  address: z.object({
    state: z.string().optional(),
    district: z.string().optional(),
    subdivision: z.string().optional(),
    villageOrWard: z.string().optional(),
    pinCode: z.string().optional(),
    landmark: z.string().optional(),
  }),
});

export const defaultValues = {
  citizenInfo: {
    fullName: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    preferredLanguage: "",
  },
  classification: { subService: "", nature: "", subject: "" },
  evidence: { details: "", occurrenceDate: "", frequency: "" },
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
    satisfactionSurveyConsent: false,
  },
  address: { state: "", district: "", subdivision: "", villageOrWard: "", pinCode: "", landmark: "" },
};
