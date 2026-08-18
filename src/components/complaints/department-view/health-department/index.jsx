import React from "react";
import { StatusBadge } from "@/components/Badges";
import {
  MapPin,
  Phone,
  User,
  Building2,
  CalendarDays,
  FileText,
  Hash,
  Mail,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import moment from "moment";

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value || value === "N/A" || value === "null" || value === null) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <div className="mt-0.5 shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">{value}</p>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-muted/30 rounded-lg border border-border/60 p-3 space-y-0.5">
    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border/60">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">{title}</h3>
    </div>
    {children}
  </div>
);

const HealthDepartmentDetailView = ({ data }) => {
  if (!data) return null;

  const payload = data?.departmentPayload || {};
  const address = payload?.address || {};
  const citizen = payload?.citizen || {};

  const incidentDate = payload?.dateOfIncident
    ? moment(Number(payload.dateOfIncident)).format("DD MMM YYYY")
    : null;

  const createdAt = data?.createdAt
    ? moment(data.createdAt).format("DD MMM YYYY, hh:mm A")
    : null;

  const locationParts = [
    address?.village,
    address?.block,
    address?.district,
    address?.division,
    address?.state,
  ].filter(Boolean);

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="bg-card rounded-xl border border-border p-3 lg:p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-2 pb-3 border-b border-border">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5">External Complaint ID</p>
              <h2 className="text-sm font-bold text-primary font-mono">
                {data?.externalComplaintId || data?._id || "N/A"}
              </h2>
            </div>
            <StatusBadge status={data?.status} />
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {createdAt && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {createdAt}
              </span>
            )}
            {data?.mobile && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {data.mobile}
              </span>
            )}
            {/* {data?.apiSyncStatus && (
              <span className="flex items-center gap-1">
                {data.apiSyncStatus === "SUCCESS" ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-yellow-500" />
                )}
                Sync: {data.apiSyncStatus}
              </span>
            )} */}
          </div>
        </div>

        {/* Grid layout: 1 col default, 2 cols on xl */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Grievance Details */}
          <SectionCard title="Grievance Details" icon={FileText}>
            <InfoRow icon={Hash} label="Grievance Type" value={payload?.grievanceType} />
            <InfoRow icon={FileText} label="Service Code" value={payload?.serviceCode} />
            <InfoRow icon={User} label="Complainant Type" value={payload?.complainantType} />
            <InfoRow icon={AlertCircle} label="Grievance Against" value={payload?.grievanceAgainstWhom} />
            <InfoRow icon={CalendarDays} label="Date of Incident" value={incidentDate} />
            <InfoRow icon={MapPin} label="Location of Incident" value={payload?.locationOfIncident} />
          </SectionCard>

          <div className="flex flex-col gap-4">
            {/* Institution Details */}
            <SectionCard title="Institution" icon={Building2}>
              <InfoRow icon={Building2} label="Institution Type" value={payload?.institutionType} />
              <InfoRow icon={Stethoscope} label="Institution Name" value={payload?.institutionName} />
            </SectionCard>

            {/* Complainant */}
            <SectionCard title="Complainant" icon={User}>
              <InfoRow icon={User} label="Name" value={citizen?.name} />
              <InfoRow icon={Phone} label="Mobile" value={citizen?.mobileNumber} />
              <InfoRow icon={Mail} label="Email" value={citizen?.emailId} />
              <InfoRow icon={User} label="Gender" value={citizen?.gender} />
            </SectionCard>
          </div>

          {/* Address — spans full width on xl */}
          {locationParts.length > 0 && (
            <SectionCard title="Address" icon={MapPin}>
              <InfoRow icon={MapPin} label="Village" value={address?.village} />
              <InfoRow icon={MapPin} label="Block" value={address?.block} />
              <InfoRow icon={MapPin} label="District" value={address?.district} />
              <InfoRow icon={MapPin} label="Division" value={address?.division} />
              {address?.locality?.name && (
                <InfoRow icon={MapPin} label="Locality" value={address.locality.name} />
              )}
            </SectionCard>
          )}

          {/* Description — spans full width on xl */}
          {payload?.description && (
            <SectionCard title="Description" icon={FileText}>
              <p className="text-sm text-foreground leading-relaxed pt-1">{payload.description}</p>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDepartmentDetailView;