import instance from "@/lib/axios";

export const getDashboardAnalytics = (params) => {
    return instance.get("/grievances/officer/dashboard-analytics", { params });
};