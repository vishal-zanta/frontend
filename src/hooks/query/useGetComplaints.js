import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getComplaintsOfOfficer,
  getComplaintById,
  getComplaintsForCCEandAdmin,
  getComplaintByIdForOfficer,
} from "@/api/complaint.api";
import { QUERY_KEYS } from "@/utils/constants";

export const useGetComplaintsOfOfiicer = (params = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER, params],
    queryFn: ({ pageParam = 1 }) => getComplaintsOfOfficer({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination || lastPage?.pagination || lastPage?.data?.data?.pagination;
      if (!pagination) return undefined;
      const currentPage = pagination.page || pagination.currentPage || 1;
      const totalPages = pagination.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    ...options,
  });
};

export const useGetComplaintById = (id, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPLAINT_DETAIL, id],
    queryFn: () => getComplaintById({ id }),
    enabled: !!id,
    ...options,
  });
};

export const useGetComplaintsForCCEandAdmin = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPLAINTS_ALL, params],
    queryFn: () => getComplaintsForCCEandAdmin(params),
    ...options,
  });
};

export const useGetComplaintsForCCEandAdminInfinite = (params = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.COMPLAINTS_ALL, params],
    queryFn: ({ pageParam = 1 }) => getComplaintsForCCEandAdmin({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination || lastPage?.pagination || lastPage?.data?.data?.pagination;
      if (!pagination) return undefined;
      const currentPage = pagination.page || pagination.currentPage || 1;
      const totalPages = pagination.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    ...options,
  });
};

export const useGetComplaintsOfOfficer = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER, params],
    queryFn: () => getComplaintsOfOfficer(params),
    ...options,
  });
};

export const useGetComplaintByIdForOfficer = (id, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPLAINT_DETAIL_OFFICER, id],
    queryFn: () => getComplaintByIdForOfficer({ id }),
    enabled: !!id,
    ...options,
  });
};
