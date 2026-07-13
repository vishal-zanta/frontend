import instance from "../lib/axios";

export const postLogin = async (credentials) => {
  return instance.post("/auth/login", credentials);
};

export const getProfile = async () => {
  return instance.get("/auth/profile");
};

export const postAdminLogout = async (userId) => {
  return instance.post(`/activity/admin-logout/${userId}`);
};

export const postLogout = async () => {
  return instance.post("/auth/logout");
};
