import instance from "../lib/axios";

export const getBreakStatus = async () => {
  return instance.get("/breaks/status");
};

export const getMyBreaks = async (params = {}) => {
  return instance.get("/breaks/my-breaks", { params });
};

export const postToggleBreak = async () => {
  return instance.post("/breaks/toggle");
};

export const getUserBreaks = async (id, params = {}) => {
  return instance.get(`/breaks/user/${id}`, { params });
};

export const postPulse = async () => {
  return instance.post("/activity/pulse");
};
