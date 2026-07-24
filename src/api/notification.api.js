import instance from "@/lib/axios";

export const getNotification = async (params) => {
  return instance.get("/notifications", { params });
};

export const putReadAllNotifications = async () => {
  return instance.put("/notifications/read-all");
};

export const putReadNotification = async (id) => {
  return instance.put(`/notifications/${id}/read`);
};
