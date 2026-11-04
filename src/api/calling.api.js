import instance from "../lib/axios";

export const postMakeCall = async (data) => {
  return instance.post("/telephony/call", data);
};

export const postAnswerCall = async () => {
  return instance.post("/telephony/call/pickup");
};

export const postDropCall = async () => {
  return instance.post("/telephony/call/drop");
};

export const postHoldCall = async () => {
  return instance.post("/telephony/call/hold");
};

export const postUnholdCall = async () => {
  return instance.post("/telephony/call/unhold");
};

export const postTransferCall = async (data = {}) => {
  return instance.post("/telephony/call/transfer", data);
};

export const postConsultCall = async (data = {}) => {
  return instance.post("/telephony/call/consult", data);
};

export const postConferenceCall = async (data = {}) => {
  return instance.post("/telephony/call/conference", data);
};

export const postConsultCancel = async () => {
  return instance.post("/telephony/call/consult/cancel");
};

export const getTransferTargets = async (params = {}) => {
  return instance.get("/telephony/transfer-targets", { params });
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
