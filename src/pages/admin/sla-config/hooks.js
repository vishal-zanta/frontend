import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../utils/constants";
import { getSlaConfigs } from "./api";

export const useGetSlaconfig = (key = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SLA_CONFIGS, ...key],
    queryFn: () => getSlaConfigs(params),
    enabled: !!enabled,
  });
};
