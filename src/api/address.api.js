import instance from "../lib/axios";

// 1) GET districts: /address/districts
export const getDistricts = async (params = {}) => {
  return instance.get("/address/districts", { params });
};

// 2) GET blocks: /address/districts/:districtId/blocks
export const getBlocks = async (districtId, params = {}) => {
  return instance.get(`/address/districts/${districtId}/blocks`, { params });
};
export const getBlocksByDistrict = getBlocks;

// 3) GET panchayats: /address/blocks/:blockId/panchayats
export const getPanchayats = async (blockId, params = {}) => {
  return instance.get(`/address/blocks/${blockId}/panchayats`, { params });
};
export const getPanchayatsByBlock = getPanchayats;

// 4) GET villages: /address/panchayats/:panchayatId/villages
export const getVillages = async (panchayatId, params = {}) => {
  return instance.get(`/address/panchayats/${panchayatId}/villages`, { params });
};
export const getVillagesByPanchayat = getVillages;

// 5) GET ULBs (urban panchayats): /address/districts/:districtId/ulbs
export const getUlbs = async (districtId, params = {}) => {
  return instance.get(`/address/districts/${districtId}/ulbs`, { params });
};
export const getUlbsByDistrict = getUlbs;
export const getUrbanPanchayats = getUlbs;

// 6) GET wards: /address/ulbs/:ulbId/wards
export const getWards = async (ulbId, params = {}) => {
  return instance.get(`/address/ulbs/${ulbId}/wards`, { params });
};
export const getWardsByUlb = getWards;

// 7) GET thanas: /address/districts/:districtId/thanas
export const getThanas = async (districtId, params = {}) => {
  return instance.get(`/address/districts/${districtId}/thanas`, { params });
};
export const getThanasByDistrict = getThanas;


