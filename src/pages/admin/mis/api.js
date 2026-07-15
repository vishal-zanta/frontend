import instance from "../../../lib/axios";

export const getMisReports = async (params) => {
  return instance.get("/mis/reports", { params });
};

export const getMisStats = async (params) => {
  return instance.get("/mis/stats", { params });
};
