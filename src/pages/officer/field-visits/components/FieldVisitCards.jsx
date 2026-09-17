import React from "react";
import StatCard from "@/components/StatCard";
import { useQuery } from "@tanstack/react-query";
import { getVisitStats } from "@/api/complaint.api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { useLanguage } from "@/context/LanguageContext";

export default function FieldVisitCards({ statusFilter, onStatusChange }) {
  const { t } = useLanguage();
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.VISIT_STATS],
    queryFn: () => getVisitStats(),
  });

  const stats = statsData?.data?.data;

  return (
    <LoaderErrWrapper isLoading={isLoading} error={error}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          color="blue"
          value={stats?.total ?? 0}
          label={t("Total Visits", "कुल विजिट")}
          isClicked={!statusFilter || statusFilter === "all"}
          onClick={() => onStatusChange && onStatusChange(null)}
        />
        <StatCard
          color="amber"
          value={stats?.scheduled ?? 0}
          label={t("Scheduled", "निर्धारित")}
          isClicked={statusFilter === "SCHEDULED"}
          onClick={() => onStatusChange && onStatusChange("SCHEDULED")}
        />
        <StatCard
          color="purple"
          value={stats?.inProgress ?? 0}
          label={t("In Progress", "प्रगति पर")}
          isClicked={statusFilter === "IN_PROGRESS"}
          onClick={() => onStatusChange && onStatusChange("IN_PROGRESS")}
        />
        <StatCard
          color="emerald"
          value={stats?.completed ?? 0}
          label={t("Completed", "पूर्ण")}
          isClicked={statusFilter === "COMPLETED"}
          onClick={() => onStatusChange && onStatusChange("COMPLETED")}
        />
      </div>
    </LoaderErrWrapper>
  );
}
