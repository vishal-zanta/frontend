import { useQuery } from "@tanstack/react-query";
import { getDivisions, getSubdivisionsByDivision } from "@/api/location.api";

export const useGetDivisions = (keys = [], params = {}, enabled = true, otherOptions = {}) => {
  return useQuery({
    queryKey: ["divisions", ...keys],
    queryFn: () => getDivisions(params),
    enabled: enabled,
    ...otherOptions,
  });
};

export const useGetSubdivisionsByDivision = (
  divisionId,
  keysOrEnabled = [],
  params = {},
  enabled = true,
  otherOptions = {},
) => {
  const isSecondArgBoolean = typeof keysOrEnabled === "boolean";
  const actualKeys = isSecondArgBoolean ? [] : (Array.isArray(keysOrEnabled) ? keysOrEnabled : [keysOrEnabled]);
  const isEnabled = isSecondArgBoolean ? keysOrEnabled : enabled;
  const formattedDivisionId = Array.isArray(divisionId)
    ? divisionId.filter(Boolean).join(",")
    : divisionId;

  return useQuery({
    queryKey: ["subdivisionsByDivision", formattedDivisionId, ...actualKeys],
    queryFn: () => getSubdivisionsByDivision(formattedDivisionId, params),
    enabled: Boolean(formattedDivisionId && isEnabled),
    ...otherOptions,
  });
};

export const useGetSubdivisionsByDivisions = (divisionIds = [], enabled = true) => {
  return useGetSubdivisionsByDivision(divisionIds, enabled);
};

export default useGetDivisions;
