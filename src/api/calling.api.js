import instance from "../lib/axios";

export const postMakeCall = async (data) => {
  return instance.post("/telephony/call", data);
};

export const postAnswerCall = async (data) => {
  return instance.post("/telephony/call/answer", data);
};

export const getCalls = async (params = {}) => {
  return instance.get("/calls", { params });
};

export const patchCallEvidence = async (id, data) => {
  return instance.patch(`/calls/${id}/evidence`, data);
};
