import React, { useState } from "react";
import { FileText, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useLanguage } from "@/context/LanguageContext";
import { useCall } from "@/context/CallContext";
import ComplaintList from "@/components/complaints/ComplaintList";
import { useGetComplaintsForCCEandAdminInfinite } from "@/hooks/query/useGetComplaints";
import useSelectExternalDepartment from "@/hooks/useSelectExternalDepartment";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "../helpers";

export default function CallerComplaintHistory({ complaints = [] }) {
  const { t } = useLanguage();
  const { callState, callDetails } = useCall();
  const [viewCall, setViewCall] = useState(null);

  const isActiveCall = (callState === "connected" || callState === "ringing") && Boolean(callDetails);
  const externalDeptProps = useSelectExternalDepartment();
  const nav = useNavigate();

  if (!isActiveCall) {
    return (
      <div className="bg-card rounded-xl border border-border">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-foreground">
            {t("Caller's Complaint History", "कॉलर का शिकायत इतिहास")}
          </h3>
          {/* <Badge variant="outline" className="text-[10px] ml-auto">
            {complaints.length} {t("complaints", "शिकायतें")}
          </Badge> */}
        </div>
        <div className="divide-y divide-border">
          {/* {complaints.map((c, i) => (
            <div
              key={c.id || i}
              className="p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <ComplaintId id={c.id} className="text-xs font-semibold" />
                <StatusBadge status={c.status} />
                <PriorityBadge priority={c.priority} />
                <span className="text-xs text-muted-foreground ml-auto">
                  {c.filedDate}
                </span>
              </div>
              <div className="text-sm font-medium text-foreground">
                {c.service} → {c.subservice}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {c.ward}
              </div>
              <div className="mt-2 bg-muted/50 rounded-lg p-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {t("Notes:", "टिप्पणी:")}{" "}
                </span>
                {c.notes}
              </div>
            </div>
          ))} */}
           <div className="p-8 text-center text-sm text-muted-foreground">
          {t("No active call is present.", "कोई सक्रिय कॉल मौजूद नहीं है।")}
        </div>
        </div>
      </div>
    );
  }
  return (
    <ComplaintList
      selected={null}
      onSelect={(value) => {
        // if (value?.departmentCode) {
        //   externalDeptProps.setDept(value?.departmentCode);
        // } else {
        //   externalDeptProps?.setDept(null);
        // }
        // setSelected(value);
        nav(
          `/crm/track-complaint?complaint=${value?.grievanceId || value?.internalId}`,
        );
      }}
      setStatusUpdate={() => {}}
      onStatsChange={() => {}}
      useGetComplaintsOfOfiicer={useGetComplaintsForCCEandAdminInfinite}
      autoSelect={false}
      isCCE={true}
      externalDeptProps={externalDeptProps}
      heading={
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-foreground">
            {t("Caller's Complaint History", "कॉलर का शिकायत इतिहास")}
          </h3>
        </div>
      }
      isHideSearch={true}
      paramsMandatory={{
        search : formatPhoneNumber(callDetails?.callerId)
      }}
    />
  );
}

