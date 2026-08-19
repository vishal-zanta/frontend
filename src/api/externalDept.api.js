import instance from "@/lib/axios";

export const getExternalMasterData = (id, params = {}) => {
  return instance.get(`/external-grievances/master-data/${id}`, { params });
};
