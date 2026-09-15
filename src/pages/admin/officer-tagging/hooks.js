import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constants";
import { getOfficerTaggings } from "./api";
import {
  getDistricts,
  getBlocks,
  getPanchayats,
  getUlbs,
  getWards,
} from "@/api/address.api";
import {
  useGetDivisions,
  useGetSubdivisionsByDivision,
  useGetSubdivisionsByDivisions,
} from "@/hooks/query/useGetDivisions";

export const useGetOfficerTag = (key = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.OFFICER_TAGGINGS, ...key],
    queryFn: () => getOfficerTaggings(params),
    enabled: !!enabled,
  });
};

const CACHE_TIME = 5 * 60 * 1000;

export const useGetDistrictsList = (params = {}, enabled = true) => {
  return useQuery({
    queryKey: ["address-districts", params],
    queryFn: () => getDistricts(params),
    enabled: !!enabled,
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
  });
};

export const useGetBlocksByDistricts = (
  districtIds = [],
  enabled = true,
  params = {},
) => {
  const ids = Array.isArray(districtIds)
    ? districtIds.filter(Boolean)
    : districtIds
      ? [districtIds]
      : [];
  const commaSeparatedIds = ids.join(",");

  return useQuery({
    queryKey: ["address-blocks-by-districts", commaSeparatedIds, params],
    queryFn: async () => {
      if (!commaSeparatedIds) return [];
      const res = await getBlocks(commaSeparatedIds, params);
      return (
        res?.data?.data?.docs ||
        res?.data?.data ||
        res?.data?.docs ||
        res?.data ||
        []
      );
    },
    enabled: Boolean(enabled && commaSeparatedIds),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
  });
};

export const useGetPanchayatsByBlocks = (
  blockIds = [],
  enabled = true,
  params = {},
) => {
  const ids = Array.isArray(blockIds)
    ? blockIds.filter(Boolean)
    : blockIds
      ? [blockIds]
      : [];
  const commaSeparatedIds = ids.join(",");

  return useQuery({
    queryKey: ["address-panchayats-by-blocks", commaSeparatedIds, params],
    queryFn: async () => {
      if (!commaSeparatedIds) return [];
      const res = await getPanchayats(commaSeparatedIds, params);
      return (
        res?.data?.data?.docs ||
        res?.data?.data ||
        res?.data?.docs ||
        res?.data ||
        []
      );
    },
    enabled: Boolean(enabled && commaSeparatedIds),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
  });
};

export const useGetUlbsByDistricts = (
  districtIds = [],
  enabled = true,
  params = {},
) => {
  const ids = Array.isArray(districtIds)
    ? districtIds.filter(Boolean)
    : districtIds
      ? [districtIds]
      : [];
  const commaSeparatedIds = ids.join(",");

  return useQuery({
    queryKey: ["address-ulbs-by-districts", commaSeparatedIds, params],
    queryFn: async () => {
      if (!commaSeparatedIds) return [];
      const res = await getUlbs(commaSeparatedIds, params);
      return (
        res?.data?.data?.docs ||
        res?.data?.data ||
        res?.data?.docs ||
        res?.data ||
        []
      );
    },
    enabled: Boolean(enabled && commaSeparatedIds),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
  });
};

export const useGetWardsByUlbs = (
  ulbIds = [],
  enabled = true,
  params = {},
) => {
  const ids = Array.isArray(ulbIds)
    ? ulbIds.filter(Boolean)
    : ulbIds
      ? [ulbIds]
      : [];
  const commaSeparatedIds = ids.join(",");

  return useQuery({
    queryKey: ["address-wards-by-ulbs", commaSeparatedIds, params],
    queryFn: async () => {
      if (!commaSeparatedIds) return [];
      const res = await getWards(commaSeparatedIds, params);
      return (
        res?.data?.data?.docs ||
        res?.data?.data ||
        res?.data?.docs ||
        res?.data ||
        []
      );
    },
    enabled: Boolean(enabled && commaSeparatedIds),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
  });
};

export {
  useGetDivisions,
  useGetSubdivisionsByDivision,
  useGetSubdivisionsByDivisions,
};
