import instance from "../../../lib/axios";

export const getOfficerTaggings = async (params) => {
  return instance.get("/officer-taggings", { params });
};

export const postOfficerTagging = async (tagging) => {
  return instance.post("/officer-taggings", tagging);
};

export const putOfficerTagging = async ({ id, tagging }) => {
  return instance.put(`/officer-taggings/${id}`, tagging);
};

export const deleteOfficerTagging = async (id) => {
  return instance.delete(`/officer-taggings/${id}`);
};
