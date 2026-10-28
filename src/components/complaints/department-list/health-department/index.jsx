import React from "react";
import { StatusBadge } from "@/components/Badges";
import { MapPin, Phone } from "lucide-react";
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

const HealthDepartmentListCard = ({ data, onClick, isSelected }) => {
  const { t } = useLanguage();
  const { fields } = usePostPreCall("HEALTH");
  const externalComplaintId = data?.internalId ||  data?.externalComplaintId || data?._id || "N/A";
  const mobile = data?.mobile || data?.departmentPayload?.citizen?.mobileNumber || "N/A";
  const status = data?.status || "PENDING";
  const address = data?.departmentPayload?.address || {};
  const division = getLabel(fields?.division, address?.division, t) || address?.division || "";
  const district = getLabel(fields?.district, address?.district, t) || address?.district || "";
  const block = getLabel(fields?.block, address?.block, t) || address?.block || "";
  const village = getLabel(fields?.village, address?.village, t) || address?.village || "";

  const locationParts = [village, block, district, division].filter(Boolean);
  const locationString = locationParts.length > 0 ? locationParts.join(", ") : "N/A";

  return (
    <button
      key={data?._id || data?.id}
      onClick={() => onClick?.(data)}
      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${
        isSelected ? "bg-primary/10 border-l-4 border-primary" : "bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="text-xs font-bold text-primary font-mono">
            {externalComplaintId}
          </h2>
          <StatusBadge status={status} />
        </div>

        {mobile && mobile !== "N/A" && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span>{mobile}</span>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
        <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{locationString}</span>
      </div>
    </button>
  );
};

export default HealthDepartmentListCard;