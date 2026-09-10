import instance from "../lib/axios";

// 1) GET divisions: /address/divisions
export const getDivisions = async (params = {}) => {
  return instance.get("/address/divisions", { params });
};

// 2) GET districts by division: /address/divisions/:divisionId/districts
export const getDistrictsByDivision = async (divisionId, params = {}) => {
  return instance.get(`/address/divisions/${divisionId}/districts`, { params });
};

// 3) GET subdivisions by district: /address/districts/:districtId/subdivisions
export const getSubdivisionsByDistrict = async (districtId, params = {}) => {
  return instance.get(`/address/districts/${districtId}/subdivisions`, {
    params,
  });
};

// 4) GET blocks by subdivision: /address/subdivisions/:subdivisionId/blocks
export const getBlocksBySubdivision = async (subdivisionId, params = {}) => {
  return instance.get(`/address/subdivisions/${subdivisionId}/blocks`, {
    params,
  });
};

// 5) GET subdivisions by division: /address/subdivisions?divisionId=
export const getSubdivisionsByDivision = async (divisionId, params = {}) => {
  const formattedDivisionId = Array.isArray(divisionId)
    ? divisionId.filter(Boolean).join(",")
    : divisionId;

  return instance.get("/address/subdivisions", {
    params: { divisionId: formattedDivisionId, ...params },
  });
};


