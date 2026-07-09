import instance from "../../../lib/axios";

export const getWorkflowLevels = async (params) => {
  return instance.get("/workflow-levels", { params });
};

export const postWorkflowLevel = async (level) => {
  return instance.post("/workflow-levels", level);
};

export const putWorkflowLevel = async ({ id, level }) => {
  return instance.put(`/workflow-levels/${id}`, level);
};

export const deleteWorkflowLevel = async (id) => {
  return instance.delete(`/workflow-levels/${id}`);
};

export const reorderWorkflowLevels = async (updates) => {
  return instance.post("/workflow-levels/bulk-order", { updates });
};
