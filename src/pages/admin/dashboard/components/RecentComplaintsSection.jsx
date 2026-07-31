import React from "react";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { useGetComplaintsForCCEandAdmin } from "@/hooks/query/useGetComplaints";
import usePagination from "@/hooks/usePagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import Pagination from "@/components/Pagination";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useLanguage } from "@/context/LanguageContext";

export default function RecentComplaintsSection() {
  const { t } = useLanguage();
  const pageProps = usePagination(1);
  const { data, isLoading, error } = useGetComplaintsForCCEandAdmin({
    page: pageProps.page,
    limit: pageProps.limit,
  });

  const complaints = data?.data?.docs || [];
  const totalPages = data?.data?.pagination?.totalPages  || 1;

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-border">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-foreground">{t("Recent Complaints", "हाल की शिकायतें")}</h3>
        {/* <Link
          to="/admin/audit"
          className="text-sm text-primary hover:underline"
        >
          View Audit Trail
        </Link> */}
      </div>
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        <div className="overflow-x-auto  scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">{t("Complaint ID", "शिकायत आईडी")}</th>
                <th className="px-4 py-2 font-medium">{t("Citizen", "नागरिक")}</th>
                <th className="px-4 py-2 font-medium">{t("Service", "सेवा")}</th>
                <th className="px-4 py-2 font-medium">{t("District", "जिला")}</th>
                <th className="px-4 py-2 font-medium">{t("Status", "स्थिति")}</th>
                <th className="px-4 py-2 font-medium">{t("Priority", "प्राथमिकता")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted-foreground">
                    {t("No complaints found", "कोई शिकायत नहीं मिली")}
                  </td>
                </tr>
              ) : (
                complaints.map((c) => {
                  const citizenName = c.citizenInfo?.fullName || "-";
                  const serviceName = c.classification?.subService?.service?.title || "-";
                  const districtName = c.address?.district?.name || c.address?.district || "-";

                  return (
                    <tr key={c._id || c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5">
                        <ComplaintId id={c._id} complaint={c} />
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {citizenName}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {serviceName}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {districtName}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-2.5">
                        <PriorityBadge priority={c.assignedPriority} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {complaints.length > 0 && (
          <Pagination
            {...pageProps}
            totalPage={totalPages}
            isLoading={isLoading}
          />
        )}
      </LoaderErrWrapper>
    </div>
  );
}

