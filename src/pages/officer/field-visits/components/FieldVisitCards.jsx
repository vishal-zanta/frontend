import React from "react";
import StatCard from "@/components/StatCard";
import { useQuery } from "@tanstack/react-query";
import { getVisitStats } from "@/api/complaint.api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

export default function FieldVisitCards() {
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
          label="Total Visits"
        />
        <StatCard
          color="amber"
          value={stats?.scheduled ?? 0}
          label="Scheduled"
        />
        <StatCard
          color="purple"
          value={stats?.inProgress ?? 0}
          label="In Progress"
        />
        <StatCard
          color="emerald"
          value={stats?.completed ?? 0}
          label="Completed"
        />
      </div>
    </LoaderErrWrapper>
  );
}
