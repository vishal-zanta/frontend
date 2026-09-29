import { deleteTokenFromStorage, getTokenFromStorage } from "@/utils/helpers";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL +"/api/v1",
});

instance.interceptors.request.use(
  (config) => {
    const token = getTokenFromStorage();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response?.status === 401) {
      deleteTokenFromStorage();

      localStorage.removeItem("role");

      window.location.href = "/";
    }
    return Promise.reject(err);
  },
);

export default instance;
