import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("usertoken") || sessionStorage.getItem("usertoken");
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
      localStorage.removeItem("usertoken");
      sessionStorage.removeItem("usertoken");
      window.location.href = "/";
    }
    return Promise.reject(err);
  },
);

export default instance;
