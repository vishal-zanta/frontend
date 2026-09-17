import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { CalendarClock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGetFieldVisits } from "@/hooks/query/useGetFieldVisits";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import FieldVisitTable from "@/pages/officer/field-visits/components/FieldVisitTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ScheduledVisitsDialog() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { profiledata } = useAuth();
  const isOfficer = profiledata?.isOfficer;

  const { page, limit, ...pageProps } = usePagination(1);

  const today = moment().format("YYYY-MM-DD");
  const { data: visitsApiData, isLoading } = useGetFieldVisits(
    {
      schedule: today,
      status: "SCHEDULED",
      page,
      limit,
    },
    {
      enabled: Boolean(isOfficer),
    },
  );

  const todayVisits =
    visitsApiData?.data?.data?.docs ||
    visitsApiData?.data?.docs ||
    (Array.isArray(visitsApiData?.data) ? visitsApiData?.data : []) ||
    [];

  const totalPages =
    visitsApiData?.data?.data?.pagination?.totalPages ??
    visitsApiData?.data?.pagination?.totalPages ??
    1;

  const [openVisitDialog, setOpenVisitDialog] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    if (isOfficer && todayVisits.length > 0 && !hasPrompted) {
      setOpenVisitDialog(true);
      setHasPrompted(true);
    }
  }, [isOfficer, todayVisits.length, hasPrompted]);

  const handleVisitClick = (fv) => {
    setOpenVisitDialog(false);
    const visitParam = fv?.visitId || fv?._id;
    if (visitParam) {
      navigate(`/officer/field-visits?visit=${visitParam}`);
    }
  };

  const handleComplaintClick = (grievance) => {
    setOpenVisitDialog(false);
    const complaintParam = grievance?.grievanceId || grievance?._id;
    if (complaintParam) {
      navigate(`/officer/complaints?complaint=${complaintParam}`);
    }
  };

  if (!isOfficer) return null;

  return (
    <Dialog open={openVisitDialog} onOpenChange={setOpenVisitDialog}>
      <DialogContent className="max-w-4xl lg:max-w-5xl w-[95vw] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="pb-3 border-b border-border p-4 sm:p-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold">
                {t(
                  "Today's Scheduled Field Visits",
                  "आज के निर्धारित फील्ड विजिट",
                )}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto rounded-lg border border-border m-4 sm:m-6 mt-4 sm:mt-4 flex flex-col justify-between">
          <div className="flex-1 overflow-x-auto">
            <FieldVisitTable
              filtered={todayVisits}
              isHideAction={true}
              onVisitClick={handleVisitClick}
              onComplaintClick={handleComplaintClick}
            />
          </div>
          <div className="">
            <Pagination
              page={page}
              limit={limit}
              totalPage={totalPages}
              isLoading={isLoading}
              {...pageProps}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

