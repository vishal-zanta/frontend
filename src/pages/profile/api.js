import instance from "@/lib/axios";

export const patchUserProfile = (data) => {
  return instance.patch("/users/profile", data);
};
