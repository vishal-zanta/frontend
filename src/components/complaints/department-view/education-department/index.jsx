import React from "react";
import { StatusBadge, TypeBadge, SourceBadge } from "@/components/Badges";
import {
  MapPin,
  Phone,
  User,
  CalendarDays,
  FileText,
  Hash,
  School,
  GraduationCap,
  UserX,
  Radio,
  Tag,
  Shield,
  Layers,
} from "lucide-react";
import moment from "moment";
import {
  useGetFieldsOptions,
  useGetBlockOptions,
  useGetPanchayatOptions,
  useGetVillageOptions,
  useGetSchoolOptions,
} from "@/pages/crm/raise-ccm-complaint/department-forms/education-department/hooks";

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

const EducationDepartmentDetailView = ({ data }) => {
  const payload = data?.departmentPayload;
  const complainant = payload?.complainant;
  const location = payload?.location;
  const accused = payload?.accused;
  const departmentCode = data?.departmentCode || "EDUCATION";

  const { fields } = useGetFieldsOptions(departmentCode);
  const { blockOptions } = useGetBlockOptions(
    location?.districtCode,
    departmentCode,
  );
  const { panchayatOptions } = useGetPanchayatOptions(
    location?.blockCode,
    departmentCode,
  );
  const { villageOptions } = useGetVillageOptions(
    location?.blockCode,
    departmentCode,
  );
  const { schoolOptions } = useGetSchoolOptions(
    location?.blockCode,
    departmentCode,
  );

  if (!data) return null;

  const externalId = data?.externalComplaintId || payload?.externalRef || "N/A";

  const registeredAtFormatted = payload?.registeredAt
    ? moment(payload.registeredAt).format("DD MMM YYYY, hh:mm A")
    : data?.createdAt
      ? moment(data.createdAt).format("DD MMM YYYY, hh:mm A")
      : null;

  const shareNumberText =
    complainant?.shareNumberWithOfficer !== undefined
      ? complainant.shareNumberWithOfficer
        ? "Yes (Visible to investigating officer)"
        : "No (Keep private)"
      : null;

  const hasAccused = Boolean(accused?.name || accused?.designation);

  const hasLocation = Boolean(
    location &&
      Object.values(location).some(
        (val) => val !== 0 && val !== "" && val !== undefined && val !== null,
      ),
  );

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
                {payload?.type && (
                  <TypeBadge
                    type={payload.type}
                    className="text-[10px] px-2 py-0.5"
                  />
                )}
                {payload?.source && (
                  <SourceBadge
                    source={payload.source}
                    label={getLabel(fields?.source, payload.source)}
                    className="text-[10px] px-2 py-0.5"
                  />
                )}
              </div>
            </div>
            <StatusBadge status={data?.status} />
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {registeredAtFormatted && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {registeredAtFormatted}
              </span>
            )}
            {(data?.mobile || complainant?.mobile) && (
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5" />
                {data?.mobile || complainant?.mobile}
              </span>
            )}
          </div>
        </div>

        {/* Grid layout: 1 col default, 2 cols on xl */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Classification & Grievance Details */}
          <SectionCard title="Complaint Details" icon={FileText}>
            {payload?.type && (
              <div className="flex items-start gap-3 py-2.5 border-b border-border/50">
                <div className="mt-0.5 shrink-0">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground leading-none mb-1">
                    Complaint Type
                  </p>
                  <TypeBadge type={payload.type} />
                </div>
              </div>
            )}
            <InfoRow
              icon={Hash}
              label="Category"
              value={getLabel(fields?.categoryId, payload?.categoryId)}
            />
            {payload?.categoryOther && (
              <InfoRow
                icon={FileText}
                label="Category (Other)"
                value={payload.categoryOther}
              />
            )}
            {payload?.source && (
              <div className="flex items-start gap-3 py-2.5 border-b border-border/50">
                <div className="mt-0.5 shrink-0">
                  <Radio className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground leading-none mb-1">
                    Source Channel
                  </p>
                  <SourceBadge
                    source={payload.source}
                    label={getLabel(fields?.source, payload.source)}
                  />
                </div>
              </div>
            )}
            <InfoRow
              icon={CalendarDays}
              label="Registered At"
              value={registeredAtFormatted}
            />
          </SectionCard>

          {/* Complainant Details */}
          <SectionCard title="Complainant Details" icon={User}>
            <InfoRow
              icon={User}
              label="Complainant Name"
              value={complainant?.name}
            />
            <InfoRow
              icon={Phone}
              label="Mobile Number"
              value={complainant?.mobile}
            />
            <InfoRow
              icon={Shield}
              label="Share Number with Officer"
              value={shareNumberText}
            />
          </SectionCard>

          {/* Accused Details (if present) */}
          {hasAccused && (
            <SectionCard title="Accused Person Details" icon={UserX}>
              <InfoRow
                icon={UserX}
                label="Accused Person Name"
                value={accused?.name}
              />
              <InfoRow
                icon={FileText}
                label="Designation / Role"
                value={accused?.designation}
              />
            </SectionCard>
          )}

          {/* Location / Hierarchy Codes */}
          {hasLocation && (
            <SectionCard title="Location Details" icon={MapPin}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                <InfoRow
                  icon={MapPin}
                  label="District"
                  value={getLabel(fields?.districtCode, location?.districtCode)}
                />
                <InfoRow
                  icon={MapPin}
                  label="Block"
                  value={getLabel(blockOptions, location?.blockCode)}
                />
                <InfoRow
                  icon={Layers}
                  label="Cluster Code"
                  value={
                    location?.clusterCode && location?.clusterCode !== 0
                      ? String(location.clusterCode)
                      : null
                  }
                />
                <InfoRow
                  icon={MapPin}
                  label="Panchayat"
                  value={getLabel(panchayatOptions, location?.panchayatCode)}
                />
                <InfoRow
                  icon={MapPin}
                  label="Village"
                  value={getLabel(villageOptions, location?.villageCode)}
                />
                <InfoRow
                  icon={School}
                  label="School"
                  value={getLabel(schoolOptions, location?.schoolCode)}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Teacher Code"
                  value={
                    location?.teacherCode && location?.teacherCode !== 0
                      ? String(location.teacherCode)
                      : null
                  }
                />
              </div>
            </SectionCard>
          )}

          {/* Description — spans full width on xl */}
          {payload?.complaint && (
            <div className="xl:col-span-2">
              <SectionCard title="Complaint Description" icon={FileText}>
                <p className="text-sm text-foreground leading-relaxed pt-1 whitespace-pre-wrap">
                  {payload.complaint}
                </p>
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationDepartmentDetailView;