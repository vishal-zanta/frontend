import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock } from "lucide-react";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetComplaintsOfOfficer } from "@/hooks/query/useGetComplaints";
import usePagination from "@/hooks/usePagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import Pagination from "@/components/Pagination";
import SearchDebounced from "@/components/debounced/SearchDebounced";

export default function AssignedComplaintsTable({}) {
  const pageProps = usePagination();
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useGetComplaintsOfOfficer(
    { search, page: pageProps.page, limit: pageProps.limit },
    // [search, pageProps.page, pageProps.limit],
  );
  const complaints = data?.data?.docs || [];
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  const displayData = complaints.length > 0 ? complaints : [];

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="px-3 lg:px-5 py-3 lg:py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="font-bold text-foreground text-xs lg:text-sm">My Assigned Complaints</h3>
        <div className="flex gap-2">
          <div className="relative">
            <SearchDebounced
              handleDebouncedChange={setSearch}
              placeholder="Search by id ..."
            />
          </div>
          <Link to="/officer/complaints">
            <Button variant="outline" size="sm" className="text-xs h-7 lg:h-9">
              View All
            </Button>
          </Link>
        </div>
      </div>
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        <div className="overflow-x-auto">
          <Table filtered={displayData} />
        </div>
        <Pagination {...pageProps} totalPage={totalPages} isLoading={isLoading} />
      </LoaderErrWrapper>
    </div>
  );
}

const Table = ({ filtered = [] }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="text-left text-xs text-muted-foreground">
          <th className="px-4 py-2 font-medium">Complaint ID</th>
          <th className="px-4 py-2 font-medium">Service</th>
          <th className="px-4 py-2 font-medium">Sub-Service</th>
          <th className="px-4 py-2 font-medium">Ward</th>
          <th className="px-4 py-2 font-medium">Priority</th>
          <th className="px-4 py-2 font-medium">SLA</th>
          <th className="px-4 py-2 font-medium">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filtered.map((c, i) => {
          const complaintId = c.grievanceId || c.id || c._id || "-";
          const serviceName =
            c.classification?.subService?.service?.title ||
            c.serviceName ||
            "-";
          const subserviceName =
            c.classification?.subService?.title || c.subserviceName || "-";
          const ward = c.address?.villageOrWard || c.ward || "-";
          const priority = c.assignedPriority || c.priority || "NORMAL";
          const slaHours =
            c.classification?.subService?.sla ?? c.slaHours ?? "-";
          const status = c.status || "PENDING";

          return (
            <tr key={c._id || c.id || i} className="hover:bg-muted/30">
              <td className="px-4 py-2.5">
                <ComplaintId id={complaintId} complaint={c} />
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {serviceName}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground text-xs">
                {subserviceName}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                <MapPin className="w-3 h-3 inline mr-1" />
                {ward}
              </td>
              <td className="px-4 py-2.5">
                <PriorityBadge priority={priority} />
              </td>
              <td className="px-4 py-2.5">
                <span className="text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {slaHours}h
                </span>
              </td>
              <td className="px-4 py-2.5">
                <StatusBadge status={status} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
