import instance from "../lib/axios";

export const postMakeCall = async (data) => {
  return instance.post("/telephony/call", data);
};

export const postAnswerCall = async (data) => {
  return instance.post("/telephony/call/pickup", data);
};

export const postDropCall = async (data = {}) => {
  return instance.post("/telephony/call/drop", data);
};

export const postHoldCall = async (data = {}) => {
  return instance.post("/telephony/call/hold", data);
};

export const getCalls = async (params = {}) => {
  return instance.get("/calls", { params });
};

export const getCallDetails = async () => {
  return instance.get("/telephony/call/details");
};

export const getAgentStatus = async () => {
  return instance.get("/telephony/agent/status");
};

export const patchCallEvidence = async (id, data) => {
  return instance.patch(`/calls/${id}/evidence`, data);
};
