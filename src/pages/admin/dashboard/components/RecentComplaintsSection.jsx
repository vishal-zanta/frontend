import React from "react";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { useGetComplaintsForCCEandAdmin } from "@/hooks/query/useGetComplaints";
import usePagination from "@/hooks/usePagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import Pagination from "@/components/Pagination";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useLanguage } from "@/context/LanguageContext";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import RecentComplaintsCards from "./RecentComplaintsCards";

export default function RecentComplaintsSection() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const pageProps = usePagination(1);
  const { data, isLoading, error } = useGetComplaintsForCCEandAdmin({
    page: pageProps.page,
    limit: pageProps.limit,
  });

  const complaints = data?.data?.docs || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const tableHeaders = [
    { id: "id", label: t("Complaint ID", "शिकायत आईडी") },
    { id: "citizen", label: t("Citizen", "नागरिक") },
    { id: "service", label: t("Service", "सेवा") },
    { id: "district", label: t("District", "जिला") },
    { id: "status", label: t("Status", "स्थिति") },
    { id: "priority", label: t("Priority", "प्राथमिकता") },
  ];

  const tableBody = complaints.map((c) => {
    const citizenName = c.citizenInfo?.fullName || "N/A";
    const serviceName = c.classification?.subService?.service?.title || "N/A";
    const districtName = c.address?.district?.name || c.address?.district || "N/A";

    return {
      id: {
        render: () => <ComplaintId id={c._id} complaint={c} />,
      },
      citizen: {
        value: citizenName,
        className: "text-muted-foreground",
      },
      service: {
        value: serviceName,
        className: "text-muted-foreground",
      },
      district: {
        value: districtName,
        className: "text-muted-foreground",
      },
      status: {
        render: () => <StatusBadge status={c.status} />,
      },
      priority: {
        render: () => <PriorityBadge priority={c.assignedPriority} />,
      },
    };
  });

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-foreground">
          {t("Recent Complaints", "हाल की शिकायतें")}
        </h3>
      </div>
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        {isMobile ? (
          <div>
            <RecentComplaintsCards complaints={complaints} />
            {complaints.length > 0 && (
              <Pagination
                {...pageProps}
                totalPage={totalPages}
                isLoading={isLoading}
              />
            )}
          </div>
        ) : (
          <MyTable
            tableHeaders={tableHeaders}
            tableBody={tableBody}
            pagination={
              complaints.length > 0 && (
                <Pagination
                  {...pageProps}
                  totalPage={totalPages}
                  isLoading={isLoading}
                />
              )
            }
            emptyText={t("No complaints found", "कोई शिकायत नहीं मिली")}
          />
        )}
      </LoaderErrWrapper>
    </div>
  );
}
