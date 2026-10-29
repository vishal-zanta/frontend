import React from "react";
import { StatusBadge, TypeBadge, SourceBadge } from "@/components/Badges";
import ComplaintTimeline from "@/components/ComplaintTimeline";
import CallCitizenButton from "@/components/complaints/CallCitizenButton";
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
  Clock,
} from "lucide-react";
import moment from "moment";
import {
  useGetFieldsOptions,
  useGetBlockOptions,
  useGetPanchayatOptions,
  useGetVillageOptions,
  useGetSchoolOptions,
} from "@/pages/crm/raise-ccm-complaint/department-forms/education-department/hooks";
import { useLanguage } from "@/context/LanguageContext";

const getLabel = (options = [], val, t) => {
  if (
    val === undefined ||
    val === null ||
    val === "" ||
    val === 0 ||
    val === "0"
  )
    return null;
  const match = options?.find((opt) => String(opt.value) === String(val));
  if (!match) return String(val);
  return t ? t(match.label, match.labelHindi || match.label) : match.label;
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
  const { t } = useLanguage();
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

  const externalId = data?.internalId ||  data?.externalComplaintId || payload?.externalRef || "N/A";

  const registeredAtFormatted = payload?.registeredAt
    ? moment(payload.registeredAt).format("DD MMM YYYY, hh:mm A")
    : data?.createdAt
      ? moment(data.createdAt).format("DD MMM YYYY, hh:mm A")
      : null;

  const shareNumberText =
    complainant?.shareNumberWithOfficer !== undefined
      ? complainant.shareNumberWithOfficer
        ? t("Yes (Visible to investigating officer)", "हाँ (जांच अधिकारी को दिखाई देगा)")
        : t("No (Keep private)", "नहीं (गोपनीय रखें)")
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
                {t("Complaint ID", "शिकायत संख्या")}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-primary font-mono">
                  {externalId}
                </h2>
              </div>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {t("Department", "विभाग")}: {t("Education Department", "शिक्षा विभाग")}
              </p>
            </div>
            <StatusBadge status={data?.status} />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {registeredAtFormatted && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {registeredAtFormatted}
              </span>
            )}
            {(data?.mobile || complainant?.mobile) && (
              <div className="flex items-center gap-2 font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {data?.mobile || complainant?.mobile}
                </span>
                <CallCitizenButton
                  mobileNumber={data?.mobile || complainant?.mobile}
                  grievanceId={data?.internalId ||  data?.externalComplaintId}
                  _id={data?._id}
                />
              </div>
            )}
          </div>
        </div>

        {/* Grid layout: 1 col default, 2 cols on xl */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Classification & Grievance Details */}
          <SectionCard title={t("Complaint Details", "शिकायत विवरण")} icon={FileText}>
            <InfoRow
              icon={Hash}
              label={t("External Complaint Id", "बाहरी शिकायत संख्या")}
              value={data?.externalComplaintId}
            />
            {payload?.type && (
              <div className="flex items-start gap-3 py-2.5 border-b border-border/50">
                <div className="mt-0.5 shrink-0">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground leading-none mb-1">
                    {t("Complaint Type", "शिकायत का प्रकार")}
                  </p>
                  <TypeBadge type={payload.type} />
                </div>
              </div>
            )}
            <InfoRow
              icon={Hash}
              label={t("Category", "श्रेणी")}
              value={getLabel(fields?.categoryId, payload?.categoryId, t)}
            />
            {payload?.categoryOther && (
              <InfoRow
                icon={FileText}
                label={t("Category (Other)", "श्रेणी (अन्य)")}
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
                    {t("Source Channel", "स्रोत चैनल")}
                  </p>
                  <SourceBadge
                    source={payload.source}
                    label={getLabel(fields?.source, payload.source, t)}
                  />
                </div>
              </div>
            )}
            <InfoRow
              icon={CalendarDays}
              label={t("Registered At", "पंजीकृत तिथि")}
              value={registeredAtFormatted}
            />
          </SectionCard>

          {/* Complainant Details */}
          <SectionCard title={t("Complainant Details", "शिकायतकर्ता विवरण")} icon={User}>
            <InfoRow
              icon={User}
              label={t("Complainant Name", "शिकायतकर्ता का नाम")}
              value={complainant?.name}
            />
            <InfoRow
              icon={Phone}
              label={t("Mobile Number", "मोबाइल नंबर")}
              value={complainant?.mobile}
            />
            <InfoRow
              icon={Shield}
              label={t("Share Number with Officer", "अधिकारी के साथ नंबर साझा करें")}
              value={shareNumberText}
            />
          </SectionCard>

          {/* Accused Details (if present) */}
          {hasAccused && (
            <SectionCard title={t("Accused Person Details", "आरोपी व्यक्ति का विवरण")} icon={UserX}>
              <InfoRow
                icon={UserX}
                label={t("Accused Person Name", "आरोपी व्यक्ति का नाम")}
                value={accused?.name}
              />
              <InfoRow
                icon={FileText}
                label={t("Designation / Role", "पद / भूमिका")}
                value={accused?.designation}
              />
            </SectionCard>
          )}

          {/* Location / Hierarchy Codes */}
          {hasLocation && (
            <SectionCard title={t("Location Details", "स्थान विवरण")} icon={MapPin}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                <InfoRow
                  icon={MapPin}
                  label={t("District", "जिला")}
                  value={getLabel(fields?.districtCode, location?.districtCode, t)}
                />
                <InfoRow
                  icon={MapPin}
                  label={t("Block", "प्रखंड")}
                  value={getLabel(blockOptions, location?.blockCode, t)}
                />
                <InfoRow
                  icon={Layers}
                  label={t("Cluster Code", "क्लस्टर कोड")}
                  value={
                    location?.clusterCode && location?.clusterCode !== 0
                      ? String(location.clusterCode)
                      : null
                  }
                />
                <InfoRow
                  icon={MapPin}
                  label={t("Panchayat", "पंचायत")}
                  value={getLabel(panchayatOptions, location?.panchayatCode, t)}
                />
                <InfoRow
                  icon={MapPin}
                  label={t("Village", "गाँव")}
                  value={getLabel(villageOptions, location?.villageCode, t)}
                />
                <InfoRow
                  icon={School}
                  label={t("School", "विद्यालय")}
                  value={getLabel(schoolOptions, location?.schoolCode, t)}
                />
                <InfoRow
                  icon={GraduationCap}
                  label={t("Teacher Code", "शिक्षक कोड")}
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
              <SectionCard title={t("Complaint Description", "शिकायत का विवरण")} icon={FileText}>
                <p className="text-sm text-foreground leading-relaxed pt-1 whitespace-pre-wrap">
                  {payload.complaint}
                </p>
              </SectionCard>
            </div>
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

export default EducationDepartmentDetailView;