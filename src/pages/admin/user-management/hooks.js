import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../utils/constants";
import { getUsers } from "./users.api";

export const useGetUsers = (key = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, ...key],
    queryFn: () => getUsers(params),
    enabled: !!enabled,
  });
};