import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getInmails,
  getInmailStats,
  getInmailById,
  patchInmailStatus,
} from "@/api/inmail.api";
import { QUERY_KEYS } from "@/utils/constants";

export const useGetInmails = (keys = [], params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INMAILS, ...keys, params],
    queryFn: () => getInmails(params),
    ...options,
  });
};

export const useGetInmailStats = (keys = [], params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INMAIL_STATS, ...keys, params],
    queryFn: () => getInmailStats(params),
    ...options,
  });
};

export const useGetInmailById = (id, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INMAILS, id],
    queryFn: () => getInmailById(id),
    enabled: !!id,
    ...options,
  });
};

export const usePatchInmailStatus = (options = {}) => {
  return useMutation({
    mutationFn: patchInmailStatus,
    ...options,
  });
};

export default useGetInmails;
