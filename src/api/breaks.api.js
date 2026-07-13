import instance from "../lib/axios";

export const getBreakStatus = async () => {
  return instance.get("/breaks/status");
};

export const postToggleBreak = async () => {
  return instance.post("/breaks/toggle");
};

export const postPulse = async () => {
  return instance.post("/activity/pulse");
};
