import { useQuery } from "@tanstack/react-query";
import { getSystemHealth } from "./api";
import { QUERY_KEYS } from "@/utils/constants";

export const useGetSystemHealth = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SYSTEM_HEALTH, params],
    queryFn: () => getSystemHealth(params),
    ...options,
  });
};

export const useGetsystemHeath = useGetSystemHealth;


