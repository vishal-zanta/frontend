import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../utils/constants";
import { getMisReports, getMisStats } from "./api";

export const useGetMisReports = (key = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MIS_REPORTS, ...key],
    queryFn: () => getMisReports(params),
    enabled: !!enabled,
  });
};

export const useGetMisStats = (key = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MIS_STATS, ...key],
    queryFn: () => getMisStats(params),
    enabled: !!enabled,
  });
};
