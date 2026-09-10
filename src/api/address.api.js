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

// 4) GET thanas: /address/blocks/:blockId/thanas
export const getThanas = async (blockId, params = {}) => {
  return instance.get(`/address/blocks/${blockId}/thanas`, { params });
};
export const getThanasByBlock = getThanas;
