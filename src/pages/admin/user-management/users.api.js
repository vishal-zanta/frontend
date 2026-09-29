import instance from "../../../lib/axios";

export const getUsers = async (params) => {
  return instance.get("/users", { params });
};

export const postUser = async (user) => {
  return instance.post("/users", user);
};

export const putUser = async ({ userId, user }) => {
  return instance.put(`/users/${userId}`, user);
};

export const putCCEConfig = async ({ id, body, ...rest }) => {
  return instance.put(`/users/${id}/cce-config`, body !== undefined ? body : rest);
};

export const deleteUser = async (id) => {
  return instance.delete(`/users/${id}`);
};