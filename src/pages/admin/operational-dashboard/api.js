import { instance } from "@/lib/axios";

export const getSystemHealth = (params)=> {
    return instance.get("/health", { params });
}