import instance from "../lib/axios";

const getConfig = async () => {
  return instance.get("/config").then((res) => res.data);
};

export { getConfig };
