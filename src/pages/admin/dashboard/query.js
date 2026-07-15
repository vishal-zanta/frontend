import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "./api";

export const useGetDashboardData = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-dashboard-analytics", params],
    queryFn: () => getDashboardAnalytics(params),
    ...options,
  });
};
