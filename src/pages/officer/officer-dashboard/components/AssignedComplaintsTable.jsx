import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { Button } from "@/components/ui/button";
import { useGetComplaintsOfOfficer } from "@/hooks/query/useGetComplaints";
import usePagination from "@/hooks/usePagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import Pagination from "@/components/Pagination";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import { useLanguage } from "@/context/LanguageContext";
import { getEntityLabel } from "@/utils/helpers";

export default function AssignedComplaintsTable() {
  const { t } = useLanguage();
  const pageProps = usePagination();
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useGetComplaintsOfOfficer({
    search,
    page: pageProps.page,
    limit: pageProps.limit,
  });
  const complaints = data?.data?.docs || [];
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  const displayData = complaints.length > 0 ? complaints : [];

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="px-3 lg:px-5 py-3 lg:py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="font-bold text-foreground text-xs lg:text-sm">
          {t("My Assigned Complaints", "मेरी सौंपी गई शिकायतें")}
        </h3>
        <div className="flex gap-2">
          <div className="relative">
            <SearchDebounced
              handleDebouncedChange={setSearch}
              placeholder={t("Search by id ...", "आईडी द्वारा खोजें ...")}
            />
          </div>
          <Link to="/officer/complaints">
            <Button variant="outline" size="sm" className="text-xs h-7 lg:h-9">
              {t("View All", "सभी देखें")}
            </Button>
          </Link>
        </div>
      </div>
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        <div className="overflow-x-auto">
          <Table filtered={displayData} t={t} />
        </div>
        <Pagination
          {...pageProps}
          totalPage={totalPages}
          isLoading={isLoading}
        />
      </LoaderErrWrapper>
    </div>
  );
}

const formatLocation = (c, t) => {
  const loc = c.location || c.address || c.citizenInfo?.address || {};
  const isUrban = Boolean(loc.isUrban);
  const districtName = getEntityLabel(loc.district, t);
  const urbanPanchayatName = getEntityLabel(loc.urbanPanchayat, t);
  const wardName = getEntityLabel(loc.ward, t);
  const villageName = getEntityLabel(loc.village, t);
  const panchayatName = getEntityLabel(loc.panchayat, t);
  const blockName = getEntityLabel(loc.block || loc.subdivision, t);
  const villageOrWard = getEntityLabel(loc.villageOrWard, t);
  const pincode = loc.pincode || loc.pinCode;

  const parts = isUrban
    ? [wardName, urbanPanchayatName, districtName, pincode]
    : [
        villageName,
        panchayatName,
        blockName,
        villageOrWard,
        districtName,
        pincode,
      ];

  const filtered = parts.filter(Boolean);
  if (filtered.length > 0) return filtered.join(", ");
  if (loc.addressLine) return loc.addressLine;
  if (c.ward) return c.ward;
  return "N/A";
};

const Table = ({ filtered = [], t }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="text-left text-xs text-muted-foreground">
          <th className="px-4 py-2 font-medium">
            {t("Complaint ID", "शिकायत आईडी")}
          </th>
          <th className="px-4 py-2 font-medium">{t("Service", "सेवा")}</th>
          <th className="px-4 py-2 font-medium">{t("Location", "स्थान")}</th>
          <th className="px-4 py-2 font-medium">
            {t("Priority", "प्राथमिकता")}
          </th>
          <th className="px-4 py-2 font-medium">{t("SLA", "एसएलए")}</th>
          <th className="px-4 py-2 font-medium">{t("Status", "स्थिति")}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filtered.map((c, i) => {
          const complaintId = c.grievanceId || c.id || c._id || "N/A";
          const serviceName =
            getEntityLabel(
              c.classification?.service ||
                c.serviceDetails ||
                c.service ||
                c.classification?.subService?.service ||
                c.serviceName,
              t,
            ) || "N/A";

          const locationText = formatLocation(c, t);
          const priority = c.assignedPriority || c.priority || "NORMAL";
          const slaHours =
            c.classification?.service?.sla ??
            c.classification?.subService?.sla ??
            c.slaHours ??
            "N/A";
          const status = c.status || "PENDING";

          return (
            <tr key={c._id || c.id || i} className="hover:bg-muted/30">
              <td className="px-4 py-2.5 text-nowrap">
                <ComplaintId id={complaintId} complaint={c} />
              </td>
              <td className="px-4 py-2.5 text-foreground font-medium text-nowrap">
                {serviceName}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground text-xs max-w-xs truncate">
                {locationText && locationText !== "N/A" && (
                  <MapPin className="w-3 h-3 inline mr-1 text-primary shrink-0" />
                )}
                {locationText}
              </td>
              <td className="px-4 py-2.5 text-nowrap">
                <PriorityBadge priority={priority} />
              </td>
              <td className="px-4 py-2.5">
                <span className="text-xs text-muted-foreground text-nowrap">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {slaHours !== "N/A" ? `${slaHours}h` : "N/A"}
                </span>
              </td>
              <td className="px-4 py-2.5 text-nowrap">
                <StatusBadge status={status} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

