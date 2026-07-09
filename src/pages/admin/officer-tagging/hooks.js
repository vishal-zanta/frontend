import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../utils/constants";
import { getOfficerTaggings } from "./api";

export const useGetOfficerTag = (key = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.OFFICER_TAGGINGS, ...key],
    queryFn: () => getOfficerTaggings(params),
    enabled: !!enabled,
  });
};
