import instance from "@/lib/axios";

export const getCCEDashboardAnalytics = (params) => {
  return instance.get("/grievances/cce/dashboard-analytics", { params });
};

export const getCCETracking = (params) => {
  return instance.get("/users/cce-tracking", { params });
};

