import { useQuery } from "@tanstack/react-query";
import { getDistricts } from "@/api/address.api";
import { QUERY_KEYS } from "@/utils/constants";

export const useGetDistricts = (keys = [], params = {}, enabled = true, otherOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DISTRICTS || "districts", ...keys],
    queryFn: () => getDistricts(params),
    enabled: enabled,
    ...otherOptions,
  });
};

export default useGetDistricts;
