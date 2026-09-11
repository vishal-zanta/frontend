import instance from "../lib/axios";

export const getInmails = async (params = {}) => {
  return instance.get("/emails", { params });
};

export const getInmailStats = async (params = {}) => {
  return instance.get("/emails/stats", { params });
};

export const getInmailById = async (id) => {
  return instance.get(`/emails/${id}`);
};

export const patchInmailStatus = async ({ id, status, rejectionReason, closeReason }) => {
  return instance.patch(`/emails/${id}/status`, {
    status,
    ...(rejectionReason !== undefined ? { rejectionReason } : {}),
    ...(closeReason !== undefined ? { closeReason } : {}),
  });
};

export const getEmails = getInmails;
export const getEmailsStats = getInmailStats;
export const getEmailById = getInmailById;
export const patchEmailStatus = patchInmailStatus;
