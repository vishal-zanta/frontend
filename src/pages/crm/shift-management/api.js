import instance from "@/lib/axios";

export const getShifts = async (params = {}) => {
  return instance.get("/shifts", { params });
};

export const assignShift = async (body) => {
  return instance.post("/shifts/assign", body);
};
