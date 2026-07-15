import instance from "@/lib/axios";

export const getDashboardAnalytics = (params) => {
  return instance.get("/grievances/admin/dashboard-analytics", { params });
};
