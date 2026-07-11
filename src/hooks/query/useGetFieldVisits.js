import { useQuery } from "@tanstack/react-query";
import { getFieldVisits } from "@/api/complaint.api";

export const useGetFieldVisits = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["field-visits", JSON.stringify(params)],
    queryFn: () => getFieldVisits(params),
    ...options,
  });
};
