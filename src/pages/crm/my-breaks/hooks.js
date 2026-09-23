import { useQuery } from "@tanstack/react-query";
import { getMyBreaks } from "@/api/breaks.api";

export const useGetMyBreaks = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["my-breaks", params],
    queryFn: () => getMyBreaks(params),
    ...options,
  });
};
