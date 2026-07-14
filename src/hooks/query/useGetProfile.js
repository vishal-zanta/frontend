import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/auth.api";

export const useGetProfile = (options = {}) => {
  return useQuery({
    queryKey: ["auth-profile"],
    queryFn: getProfile,
    retry: false,
    ...options,
  });
};
