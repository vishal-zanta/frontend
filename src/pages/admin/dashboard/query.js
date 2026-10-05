import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics, getVisitLineGraph, getVisitsByDate } from "./api";

export const useGetDashboardData = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-dashboard-analytics", params],
    queryFn: () => getDashboardAnalytics(params),
    ...options,
  });
};

export const useGetVisitLineGraph = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["visit-line-graph", params],
    queryFn: () => getVisitLineGraph(params),
    ...options,
  });
};

export const useGetVisitsByDate = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["visits-by-date", params],
    queryFn: () => getVisitsByDate(params),
    enabled: Boolean(params?.date),
    ...options,
  });
};

