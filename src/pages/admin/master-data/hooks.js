import { getServices, getSubservices, getComplaintSources, getDemographics, getUlbs, getOptions, getOptionTypes, getDepartments, getSkills, getApiKeys } from "./api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../utils/constants";

export const useGetServices = (keys = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICES, ...keys],
    queryFn: () => getServices(params),
    enabled: enabled
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

export const useGetUlbs = (keys = [], params = {} , enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ULBS, ...keys],
    queryFn: () => getUlbs(params),
    enabled : enabled
  });
};

export const useGetOptions = (keys = [], params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.OPTIONS, ...keys],
    queryFn: () => getOptions(params),
  });
};

export const useGetOptionTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.OPTION_TYPES],
    queryFn: getOptionTypes,
  });
};

export const useGetDepartments = (keys = [], params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DEPARTMENTS, ...keys],
    queryFn: () => getDepartments(params),
  });
};

export const useGetSkills = (keys = [], params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SKILLS, ...keys],
    queryFn: () => getSkills(params),
  });
};

export const useGetApiKeys = (keys = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.API_KEYS, ...keys],
    queryFn: () => getApiKeys(params),
    enabled: enabled,
  });
};