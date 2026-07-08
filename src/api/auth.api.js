import instance from "../lib/axios";

export const postLogin = async (credentials) => {
  return instance.post("/auth/login", credentials);
};

export const getProfile = async () => {
  return instance.get("/auth/profile");
};
