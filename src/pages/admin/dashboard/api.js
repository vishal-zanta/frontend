import instance from "@/lib/axios";

export const getDashboardAnalytics = (params) => {
  return instance.get("/grievances/admin/dashboard-analytics", { params });
};

export const getVisitLineGraph = (params) => {
  return instance.get("/visits/line-graph", { params });
};

export const getVisitsByDate = (params) => {
  return instance.get("/visits/by-date", { params });
};

