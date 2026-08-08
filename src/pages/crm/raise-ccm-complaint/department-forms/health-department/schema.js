import { z } from "zod";

const schema = z
  .object({
    dateOfIncident: z.string().min(1, "Please select date of incident"),
    locationOfIncident: z.string().min(1, "Please enter location of incident"),
    complainantType: z.string().min(1, "Please select complainant type"),
    citizen: z.object({
      name: z.string().min(2, "Please enter valid name"),
      mobileNumber: z.string().length(10, "Please enter valid mobile number"),
      gender: z.string().optional(),
    }),
    grievanceType: z.string().min(1, "Please select grievance type"),
    // grievanceSubType: z.string().min(1, "Please select grievance sub type"),
    address: z.object({
      district: z.string().min(1, "Please select district"),
      block: z.string().min(1, "Please select block"),
      village: z.string().optional(),
    }),
    institutionType: z.string().min(1, "Please select institution type"),
    institutionName: z.string().optional(),
    grievanceAgainstWhom: z.string().optional(),
    description: z.string().min(1, "Please enter brief of grievance"),
    uploadRelatedDocument: z.instanceof(File).optional().nullable(),
  })
  .passthrough();

export default schema;
