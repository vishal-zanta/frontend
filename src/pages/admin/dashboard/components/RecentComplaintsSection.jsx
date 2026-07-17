import React from "react";
import { Link } from "react-router-dom";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { useGetComplaintsForCCEandAdmin } from "@/hooks/query/useGetComplaints";
import usePagination from "@/hooks/usePagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import Pagination from "@/components/Pagination";
import { StatusBadge, PriorityBadge } from "@/components/Badges";

export default function RecentComplaintsSection() {
  const pageProps = usePagination(1);
  const { data, isLoading, error } = useGetComplaintsForCCEandAdmin({
    page: pageProps.page,
    limit: pageProps.limit,
  });

  const complaints = data?.data?.docs || [];
  const totalPages = data?.data?.pagination?.totalPages  || 1;

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-foreground">Recent Complaints</h3>
        <Link
          to="/admin/audit"
          className="text-sm text-primary hover:underline"
        >
          View Audit Trail
        </Link>
      </div>
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-[#F4F7FA] sticky top-0">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Complaint ID</th>
                <th className="px-4 py-2 font-medium">Citizen</th>
                <th className="px-4 py-2 font-medium">Service</th>
                <th className="px-4 py-2 font-medium">District</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted-foreground">
                    No complaints found
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

