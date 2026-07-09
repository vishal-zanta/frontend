import instance from "../../../lib/axios";

export const getSlaConfigs = async (params) => {
  return instance.get("/sla-configs", { params });
};

export const postSlaConfig = async (config) => {
  return instance.post("/sla-configs", config);
};

export const putSlaConfig = async ({ id, config }) => {
  return instance.put(`/sla-configs/${id}`, config);
};

export const deleteSlaConfig = async (id) => {
  return instance.delete(`/sla-configs/${id}`);
};
