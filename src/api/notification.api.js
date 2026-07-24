import instance from "@/lib/axios";

export const getNotification = async (params) => {
  return instance.get("/notifications", { params });
};
