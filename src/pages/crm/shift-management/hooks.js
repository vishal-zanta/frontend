import { useQuery } from "@tanstack/react-query";
import { getShifts } from "./api";
import { QUERY_KEYS } from "@/utils/constants";

export const useGetShifts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SHIFTS, params],
    queryFn: () => getShifts(params),
    ...options,
  });
};
