import instance from "@/lib/axios";

export const getCCEDashboardAnalytics = (params) => {
  return instance.get("/grievances/cce/dashboard-analytics", { params });
};
