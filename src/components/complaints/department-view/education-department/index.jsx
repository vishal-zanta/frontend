import React from "react";
import { StatusBadge } from "@/components/Badges";
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
import { Badge } from "@/components/ui/badge";

const InfoRow = ({ icon: Icon, label, value }) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "null" ||
    value === "N/A"
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
  if (!data) return null;

  const payload = data?.departmentPayload || data || {};
  const complainant = payload?.complainant || {};
  const location = payload?.location || {};
  const accused = payload?.accused || {};

  const externalId =
    data?.externalComplaintId ||
    payload?.externalRef ||
    data?.externalRef ||
    data?._id ||
    "N/A";

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

  const hasAccused =
    (accused?.name && accused?.name !== "string") ||
    (accused?.designation && accused?.designation !== "string");

  const hasLocation =
    location?.districtCode !== undefined ||
    location?.blockCode !== undefined ||
    location?.clusterCode !== undefined ||
    location?.panchayatCode !== undefined ||
    location?.villageCode !== undefined ||
    location?.schoolCode !== undefined ||
    location?.teacherCode !== undefined;

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
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-semibold tracking-wider"
                  >
                    {payload.type}
                  </Badge>
                )}
                {payload?.source && (
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono font-medium">
                    {payload.source}
                  </span>
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
            <InfoRow
              icon={Tag}
              label="Complaint Type"
              value={payload?.type}
            />
            <InfoRow
              icon={Hash}
              label="Category ID"
              value={payload?.categoryId ? String(payload.categoryId) : null}
            />
            {payload?.categoryOther && payload?.categoryOther !== "string" && (
              <InfoRow
                icon={FileText}
                label="Category (Other)"
                value={payload.categoryOther}
              />
            )}
            <InfoRow
              icon={Radio}
              label="Source Channel"
              value={payload?.source}
            />
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
                value={
                  accused?.name && accused?.name !== "string"
                    ? accused.name
                    : null
                }
              />
              <InfoRow
                icon={FileText}
                label="Designation / Role"
                value={
                  accused?.designation && accused?.designation !== "string"
                    ? accused.designation
                    : null
                }
              />
            </SectionCard>
          )}

          {/* Location / Hierarchy Codes */}
          {hasLocation && (
            <SectionCard title="Location & Institution Hierarchy" icon={MapPin}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                <InfoRow
                  icon={MapPin}
                  label="District Code"
                  value={
                    location?.districtCode !== undefined &&
                    location?.districtCode !== null
                      ? String(location.districtCode)
                      : null
                  }
                />
                <InfoRow
                  icon={MapPin}
                  label="Block Code"
                  value={
                    location?.blockCode !== undefined &&
                    location?.blockCode !== null &&
                    location?.blockCode !== 0
                      ? String(location.blockCode)
                      : null
                  }
                />
                <InfoRow
                  icon={Layers}
                  label="Cluster Code"
                  value={
                    location?.clusterCode !== undefined &&
                    location?.clusterCode !== null &&
                    location?.clusterCode !== 0 &&
                    location?.clusterCode !== ""
                      ? String(location.clusterCode)
                      : null
                  }
                />
                <InfoRow
                  icon={MapPin}
                  label="Panchayat Code"
                  value={
                    location?.panchayatCode !== undefined &&
                    location?.panchayatCode !== null &&
                    location?.panchayatCode !== 0 &&
                    location?.panchayatCode !== ""
                      ? String(location.panchayatCode)
                      : null
                  }
                />
                <InfoRow
                  icon={MapPin}
                  label="Village Code"
                  value={
                    location?.villageCode !== undefined &&
                    location?.villageCode !== null &&
                    location?.villageCode !== 0 &&
                    location?.villageCode !== ""
                      ? String(location.villageCode)
                      : null
                  }
                />
                <InfoRow
                  icon={School}
                  label="School Code"
                  value={
                    location?.schoolCode !== undefined &&
                    location?.schoolCode !== null &&
                    location?.schoolCode !== 0 &&
                    location?.schoolCode !== ""
                      ? String(location.schoolCode)
                      : null
                  }
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Teacher Code"
                  value={
                    location?.teacherCode !== undefined &&
                    location?.teacherCode !== null &&
                    location?.teacherCode !== 0 &&
                    location?.teacherCode !== ""
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