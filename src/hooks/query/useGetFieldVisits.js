import { useQuery } from "@tanstack/react-query";
import { getFieldVisits } from "@/api/complaint.api";
import { QUERY_KEYS } from "@/utils/constants";

export const useGetFieldVisits = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FIELD_VISITS, JSON.stringify(params)],
    queryFn: () => getFieldVisits(params),
    ...options,
  });
};
