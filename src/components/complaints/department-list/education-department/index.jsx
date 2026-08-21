import React from "react";
import { StatusBadge, TypeBadge, SourceBadge } from "@/components/Badges";
import {
  MapPin,
  Phone,
  User,
  CalendarDays,
  GraduationCap,
  UserX,
} from "lucide-react";
import moment from "moment";

const EducationDepartmentListCard = ({ data, onClick, isSelected }) => {
  const payload = data?.departmentPayload;
  const externalRef = data?.externalComplaintId || payload?.externalRef || "N/A";
  const status = data?.status || "PENDING";
  const type = payload?.type;
  const complaintText = payload?.complaint || "";
  const complainantName = payload?.complainant?.name || "";
  const mobile = data?.mobile || payload?.complainant?.mobile || "";
  const source = payload?.source || "";
  const registeredAt = payload?.registeredAt || data?.createdAt;

  const formattedDate =
    registeredAt && moment(registeredAt).isValid()
      ? moment(registeredAt).format("DD MMM YYYY")
      : null;

  const accused = payload?.accused;
  const hasAccused = Boolean(accused?.name);

  return (
    <button
      key={data?._id || data?.id}
      onClick={() => onClick?.(data)}
      className={`w-full text-left px-4 py-3.5 hover:bg-muted/50 transition-all cursor-pointer border-b border-border/50 ${
        isSelected ? "bg-primary/10 border-l-4 border-primary" : "bg-card"
      }`}
    >
      {/* Header: ID, Type Badge, Source, and Status */}
      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs font-bold text-primary font-mono tracking-tight">
            {externalRef}
          </span>
          {type && <TypeBadge type={type} />}
          {source && <SourceBadge source={source} />}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Complaint Description Snippet */}
      {complaintText && (
        <p className="text-xs font-medium text-foreground line-clamp-2 mb-2 leading-relaxed">
          {complaintText}
        </p>
      )}

      {/* Complainant & Contact */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground flex-wrap mb-1.5">
        {complainantName && (
          <div className="flex items-center gap-1 min-w-0">
            <User className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80" />
            <span className="truncate font-medium text-foreground/85">
              {complainantName}
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

      {/* Footer: Location, Accused or Date */}
      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground/80 pt-1.5 border-t border-border/40">
       { hasAccused ? (
          <div className="flex items-center gap-1 truncate max-w-[60%] text-destructive/80">
            <UserX className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {accused.name}{" "}
        
            </span>
          </div>
        ) : null}

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

export default EducationDepartmentListCard;