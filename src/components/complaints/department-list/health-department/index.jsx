import React from "react";
import { StatusBadge } from "@/components/Badges";
import { MapPin, Phone } from "lucide-react";

const HealthDepartmentListCard = ({ data, onClick, isSelected }) => {
  const externalComplaintId = data?.externalComplaintId || data?._id || "N/A";
  const mobile = data?.mobile || data?.departmentPayload?.citizen?.mobileNumber || "N/A";
  const status = data?.status || "PENDING";
  const address = data?.departmentPayload?.address || {};
  const division = address?.division || "";
  const district = address?.district || "";
  const block = address?.block || "";
  const village = address?.village || "";

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