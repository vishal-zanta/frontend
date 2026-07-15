import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constants";
import { getDashboardAnalytics } from "./api";

export const useGetDashboardData = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUERY_KEY_OFIICER_DASHBOARD, params],
    queryFn: () => getDashboardAnalytics(params),
    ...options,
  });
};