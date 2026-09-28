import React from "react";
import { StatusBadge } from "@/components/Badges";
import ComplaintTimeline from "@/components/ComplaintTimeline";
import CallCitizenButton from "@/components/complaints/CallCitizenButton";
import {
  MapPin,
  Phone,
  User,
  CalendarDays,
  FileText,
  Hash,
  UserCheck,
  Tag,
  Clock,
  Activity,
  Layers,
} from "lucide-react";
import moment from "moment";
import {
  useGetFoodOptions,
  useGetFoodDistrictOptions,
  useGetFoodBlockOptions,
  useGetFoodPanchayatOptions,
  useGetFoodVillageOptions,
} from "@/pages/crm/raise-ccm-complaint/department-forms/food-department/hooks";

const getLabel = (options = [], val) => {
  if (
    val === undefined ||
    val === null ||
    val === "" ||
    val === 0 ||
    val === "0"
  )
    return null;
  const match = options?.find((opt) => String(opt.value) === String(val));
  return match ? match.label : String(val);
};

const InfoRow = ({ icon: Icon, label, value }) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "null" ||
    value === "N/A" ||
    value === 0 ||
    value === "0"
  )
    return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <div className="mt-0.5 shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground break-words">{value}</p>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-muted/30 rounded-lg border border-border/60 p-3 space-y-0.5">
    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border/60">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const FoodDeptView = ({ data }) => {
  const payload = data?.departmentPayload || {};
  const departmentCode = data?.departmentCode || "FOOD";

  const { options } = useGetFoodOptions(departmentCode);
  const { districtOptions } = useGetFoodDistrictOptions(
    payload?.stateId || 10,
    departmentCode
  );
  const { blockOptions } = useGetFoodBlockOptions(
    payload?.districtId,
    departmentCode
  );
  const { panchayatOptions } = useGetFoodPanchayatOptions(
    payload?.blockId,
    departmentCode
  );
  const { villageOptions } = useGetFoodVillageOptions(
    payload?.panchayatId,
    departmentCode
  );

  if (!data) return null;

  const externalId =
    data?.externalComplaintId ||
    payload?.grievanceID ||
    data?._id ||
    "N/A";

  const registeredAtFormatted = data?.createdAt
    ? moment(data.createdAt).format("DD MMM YYYY, hh:mm A")
    : null;

  const typeLabel = getLabel(options?.type, payload?.typeId);
  const categoryLabel = getLabel(options?.category, payload?.categoryId);
  const stateLabel = getLabel(options?.state, payload?.stateId);
  const districtLabel = getLabel(districtOptions, payload?.districtId);
  const blockLabel = getLabel(blockOptions, payload?.blockId);
  const panchayatLabel = getLabel(panchayatOptions, payload?.panchayatId);
  const villageLabel = getLabel(villageOptions, payload?.villageId);

  const hasTimeline = Array.isArray(data?.timeline) && data.timeline.length > 0;

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="bg-card rounded-xl border border-border p-3 lg:p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-2 pb-3 border-b border-border">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5">
                External Complaint ID
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-primary font-mono">
                  {externalId}
                </h2>
              
              </div>
            </div>
            <StatusBadge status={data?.status || payload?.status} />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            {registeredAtFormatted && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {registeredAtFormatted}
              </span>
            )}
            {(data?.mobile || payload?.mobileNo) && (
              <div className="flex items-center gap-2 font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {data?.mobile || payload?.mobileNo}
                </span>
                <CallCitizenButton mobileNumber={data?.mobile || payload?.mobileNo} />
              </div>
            )}
            {payload?.assignTo && (
              <span className="flex items-center gap-1 text-primary">
                <UserCheck className="w-3.5 h-3.5" />
                Assigned: {payload.assignTo}
              </span>
            )}
          </div>
        </div>

        {/* Grid layout: 1 col default, 2 cols on xl */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Grievance Information */}
          <SectionCard title="Grievance Information" icon={FileText}>
            <InfoRow icon={Tag} label="Grievance Type" value={typeLabel} />
            <InfoRow icon={Hash} label="Category" value={categoryLabel} />
            <InfoRow icon={UserCheck} label="Assigned Officer / Unit" value={payload?.assignTo} />
            {/* <InfoRow icon={Activity} label="Created By" value={payload?.createdBy} /> */}
            <InfoRow icon={Clock} label="Registered At" value={registeredAtFormatted} />
            {payload?.resultDescription && (
              <InfoRow icon={FileText} label="Result Description" value={payload.resultDescription} />
            )}
          </SectionCard>

          {/* Citizen / Complainant Details */}
          <SectionCard title="Citizen Details" icon={User}>
            <InfoRow icon={User} label="Citizen Name" value={payload?.name} />
            <InfoRow icon={Phone} label="Mobile Number" value={payload?.mobileNo || data?.mobile} />
            <InfoRow icon={MapPin} label="Address" value={payload?.address} />
          </SectionCard>

          {/* Location / Administrative Details — spans 2 cols on xl */}
          <div className="xl:col-span-2">
            <SectionCard title="Location Details" icon={MapPin}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
                <InfoRow icon={MapPin} label="State" value={stateLabel || "Bihar"} />
                <InfoRow icon={MapPin} label="District" value={districtLabel} />
                <InfoRow icon={MapPin} label="Block" value={blockLabel} />
                <InfoRow icon={Layers} label="Panchayat" value={panchayatLabel} />
                <InfoRow icon={MapPin} label="Village" value={villageLabel} />
                <InfoRow icon={MapPin} label="Detailed Address" value={payload?.address} />
              </div>
            </SectionCard>
          </div>

          {/* Grievance Description — spans 2 cols on xl */}
          {payload?.grievancesDescription && (
            <div className="xl:col-span-2">
              <SectionCard title="Grievance Description" icon={FileText}>
                <p className="text-sm text-foreground leading-relaxed pt-1 whitespace-pre-wrap">
                  {payload.grievancesDescription}
                </p>
              </SectionCard>
            </div>
          )}

          {/* Timeline / Activity Log — spans 2 cols on xl */}
          {hasTimeline && (
            <div className="xl:col-span-2">
              <SectionCard title="Status & Activity Timeline" icon={Clock}>
                <div className="pt-2">
                  <ComplaintTimeline events={data.timeline} />
                </div>
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDeptView;