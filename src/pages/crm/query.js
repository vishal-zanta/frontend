import { useQuery } from "@tanstack/react-query";
import { getCCEDashboardAnalytics } from "./api";

export const useGetCCEDashboardData = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["cce-dashboard-analytics", params],
    queryFn: () => getCCEDashboardAnalytics(params),
    ...options,
  });
};
