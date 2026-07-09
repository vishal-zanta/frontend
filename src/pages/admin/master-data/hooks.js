import { getServices, getSubservices, getComplaintSources, getDemographics, getUlbs } from "./api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../utils/constants";

export const useGetServices = (keys = [], params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICES, ...keys],
    queryFn: () => getServices(params),
  });
};

export const useGetSubservices = (keys = [], params = {}, enabled = false) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBSERVICES, ...keys],
    queryFn: () => getSubservices(params),
    enabled: enabled
  });
};

export const useGetComplaintSources = (keys = [], params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPLAINT_SOURCES, ...keys],
    queryFn: () => getComplaintSources(params),
  });
};

export const useGetDemographics = (keys = [], params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DEMOGRAPHY, ...keys],
    queryFn: () => getDemographics(params),
  });
};

export const useGetUlbs = (keys = [], params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ULBS, ...keys],
    queryFn: () => getUlbs(params),
  });
};