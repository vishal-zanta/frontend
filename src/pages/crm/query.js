import { useQuery } from "@tanstack/react-query";
import { getCCEDashboardAnalytics, getCCETracking } from "./api";

export const useGetCCEDashboardData = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["cce-dashboard-analytics", params],
    queryFn: () => getCCEDashboardAnalytics(params),
    ...options,
  });
};

export const useGetCCETracking = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["cce-tracking", params],
    queryFn: () => getCCETracking(params),
   refetchInterval: 10 *1000,
    ...options,
  });
};

