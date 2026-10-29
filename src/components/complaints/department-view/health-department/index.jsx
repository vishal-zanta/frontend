import React from "react";
import { StatusBadge } from "@/components/Badges";
import ComplaintTimeline from "@/components/ComplaintTimeline";
import CallCitizenButton from "@/components/complaints/CallCitizenButton";
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
  Clock,
} from "lucide-react";
import moment from "moment";
import { useLanguage } from "@/context/LanguageContext";
import { usePostPreCall } from "@/pages/crm/raise-ccm-complaint/department-forms/health-department/hooks";

const getLabel = (options = [], val, t) => {
  if (
    val === undefined ||
    val === null ||
    val === "" ||
    val === 0 ||
    val === "0"
  )
    return null;
  const valStr = String(val).toLowerCase().trim();
  const match = options?.find(
    (opt) =>
      String(opt.value).toLowerCase().trim() === valStr ||
      String(opt.label).toLowerCase().trim() === valStr ||
      (opt.code && String(opt.code).toLowerCase().trim() === valStr) ||
      (opt.subType && String(opt.subType).toLowerCase().trim() === valStr),
  );
  if (!match) return String(val);
  return t ? t(match.label, match.labelHindi || match.label) : match.label;
};

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
  const { t } = useLanguage();
  const departmentCode = data?.departmentCode || "HEALTH";
  const { fields } = usePostPreCall(departmentCode);

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

  const grievanceTypeLabel =
    getLabel(fields?.grievanceType, payload?.grievanceType, t) ||
    payload?.grievanceType;
  const complainantTypeLabel =
    getLabel(fields?.complainantType, payload?.complainantType, t) ||
    payload?.complainantType;
  const institutionTypeLabel =
    getLabel(fields?.institutionType, payload?.institutionType, t) ||
    payload?.institutionType;
  const institutionNameLabel =
    getLabel(fields?.institutionName, payload?.institutionName, t) ||
    payload?.institutionName;
  const genderLabel =
    getLabel(fields?.gender, citizen?.gender, t) || citizen?.gender;
  const villageLabel =
    getLabel(fields?.village, address?.village, t) || address?.village;
  const blockLabel =
    getLabel(fields?.block, address?.block, t) || address?.block;
  const districtLabel =
    getLabel(fields?.district, address?.district, t) || address?.district;
  const divisionLabel =
    getLabel(fields?.division, address?.division, t) || address?.division;
  const localityLabel =
    getLabel(fields?.division, address?.locality?.name, t) ||
    getLabel(fields?.village, address?.locality?.name, t) ||
    getLabel(fields?.block, address?.locality?.name, t) ||
    address?.locality?.name;

  const locationParts = [
    villageLabel,
    blockLabel,
    districtLabel,
    divisionLabel,
    address?.state,
  ].filter(Boolean);

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="bg-card rounded-xl border border-border p-3 lg:p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-2 pb-3 border-b border-border">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5">
                {t("Complaint ID", "शिकायत संख्या")}
              </p>
              <h2 className="text-sm font-bold text-primary font-mono">
                {data?.internalId ||  data?.externalComplaintId || data?._id || "N/A"}
              </h2>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {t("Department", "विभाग")}: {t("Health Department", "स्वास्थ्य विभाग")}
              </p>
            </div>
            <StatusBadge status={data?.status} />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {createdAt && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {createdAt}
              </span>
            )}
            {(data?.mobile || citizen?.mobileNumber) && (
              <div className="flex items-center gap-2 font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {data?.mobile || citizen?.mobileNumber}
                </span>
                <CallCitizenButton
                  mobileNumber={data?.mobile || citizen?.mobileNumber}
                  grievanceId={data?.internalId || data?.externalComplaintId}
                  _id={data?._id}
                />
              </div>
            )}
          </div>
        </div>

        {/* Grid layout: 1 col default, 2 cols on xl */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Grievance Details */}
          <SectionCard title={t("Grievance Details", "शिकायत विवरण")} icon={FileText}>
            <InfoRow icon={Hash} label={t("External Complaint Id", "बाहरी शिकायत संख्या")} value={data?.externalComplaintId} />
            <InfoRow icon={Hash} label={t("Grievance Type", "शिकायत का प्रकार")} value={grievanceTypeLabel} />
            {/* <InfoRow icon={FileText} label={t("Service Code", "सेवा कोड")} value={payload?.serviceCode} /> */}
            <InfoRow icon={User} label={t("Complainant Type", "शिकायतकर्ता का प्रकार")} value={complainantTypeLabel} />
            <InfoRow icon={AlertCircle} label={t("Grievance Against", "किसके विरुद्ध शिकायत")} value={payload?.grievanceAgainstWhom} />
            <InfoRow icon={CalendarDays} label={t("Date of Incident", "घटना की तिथि")} value={incidentDate} />
            <InfoRow icon={MapPin} label={t("Location of Incident", "घटना का स्थान")} value={payload?.locationOfIncident} />
          </SectionCard>

          <div className="flex flex-col gap-4">
            {/* Institution Details */}
            <SectionCard title={t("Institution", "संस्थान")} icon={Building2}>
              <InfoRow icon={Building2} label={t("Institution Type", "संस्थान का प्रकार")} value={institutionTypeLabel} />
              <InfoRow icon={Stethoscope} label={t("Institution Name", "संस्थान का नाम")} value={institutionNameLabel} />
            </SectionCard>

            {/* Complainant */}
            <SectionCard title={t("Complainant", "शिकायतकर्ता")} icon={User}>
              <InfoRow icon={User} label={t("Name", "नाम")} value={citizen?.name} />
              <InfoRow icon={Phone} label={t("Mobile", "मोबाइल")} value={citizen?.mobileNumber} />
              <InfoRow icon={Mail} label={t("Email", "ईमेल")} value={citizen?.emailId} />
              <InfoRow icon={User} label={t("Gender", "लिंग")} value={genderLabel} />
            </SectionCard>
          </div>

          {/* Address — spans full width on xl */}
          {locationParts.length > 0 && (
            <SectionCard title={t("Address", "पता")} icon={MapPin}>
              <InfoRow icon={MapPin} label={t("Village", "गाँव")} value={villageLabel} />
              <InfoRow icon={MapPin} label={t("Block", "प्रखंड")} value={blockLabel} />
              <InfoRow icon={MapPin} label={t("District", "जिला")} value={districtLabel} />
              <InfoRow icon={MapPin} label={t("Division", "प्रमंडल")} value={divisionLabel} />
              {address?.locality?.name && (
                <InfoRow icon={MapPin} label={t("Locality", "इलाका")} value={localityLabel} />
              )}
            </SectionCard>
          )}

          {/* Description — spans full width on xl */}
          {payload?.description && (
            <SectionCard title={t("Description", "विवरण")} icon={FileText}>
              <p className="text-sm text-foreground leading-relaxed pt-1">{payload.description}</p>
            </SectionCard>
          )}

          {/* Timeline / Activity Log — spans 2 cols on xl */}
          {Array.isArray(data?.timeline) && data.timeline.length > 0 && (
            <div className="xl:col-span-2">
              <SectionCard title={t("Status & Activity Timeline", "स्थिति और गतिविधि समयरेखा")} icon={Clock}>
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

export default HealthDepartmentDetailView;