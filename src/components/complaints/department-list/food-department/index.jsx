import React from "react";
import { StatusBadge } from "@/components/Badges";
import {
  MapPin,
  Phone,
  User,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import moment from "moment";

const FoodDeptList = ({ data, onClick, isSelected }) => {
  const payload = data?.departmentPayload;
  const externalRef =
    data?.externalComplaintId ||
    payload?.grievanceID ||
    data?._id ||
    "N/A";
  const status = data?.status || payload?.status || "PENDING";
  const grievanceDesc = payload?.grievancesDescription || "";
  const citizenName = payload?.name || "";
  const mobile = data?.mobile || payload?.mobileNo || "";
  const address = payload?.address || "";
  const assignTo = payload?.assignTo || "";
  const createdAt = data?.createdAt || data?.updatedAt;

  const formattedDate =
    createdAt && moment(createdAt).isValid()
      ? moment(createdAt).format("DD MMM YYYY")
      : null;

  return (
    <button
      key={data?._id || data?.id}
      onClick={() => onClick?.(data)}
      className={`w-full text-left px-4 py-3.5 hover:bg-muted/50 transition-all cursor-pointer border-b border-border/50 ${
        isSelected ? "bg-primary/10 border-l-4 border-primary" : "bg-card"
      }`}
    >
      {/* Header: ID, Department & Status */}
      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs font-bold text-primary font-mono tracking-tight">
            {externalRef}
          </span>
       
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Grievance Description Snippet */}
      {grievanceDesc && (
        <p className="text-xs font-medium text-foreground line-clamp-2 mb-2 leading-relaxed">
          {grievanceDesc}
        </p>
      )}

      {/* Citizen & Contact Details */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground flex-wrap mb-1.5">
        {citizenName && (
          <div className="flex items-center gap-1 min-w-0">
            <User className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80" />
            <span className="truncate font-medium text-foreground/85">
              {citizenName}
            </span>
          </div>
        )}
        {mobile && (
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Phone className="w-3 h-3 shrink-0 text-muted-foreground/80" />
            <span>{mobile}</span>
          </div>
        )}
      </div>

      {/* Footer: Location, Assigned Officer & Date */}
      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground/80 pt-1.5 border-t border-border/40 flex-wrap">
        {address ? (
          <div className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">{address}</span>
          </div>
        ) : assignTo ? (
          <div className="flex items-center gap-1 truncate max-w-[65%] text-primary/80">
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{assignTo}</span>
          </div>
        ) : <div />}

        {formattedDate && (
          <div className="flex items-center gap-1 shrink-0 ml-auto text-[10px]">
            <CalendarDays className="w-3 h-3 shrink-0" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default FoodDeptList;