import instance from "@/lib/axios";

export const getSystemHealth = (params) => {
  return instance.get("/health", { params });
};

export const getMonitoringChecks = (params) => {
  return instance.get("/checks/monitoring", { params });
};

