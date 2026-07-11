import instance from "../lib/axios";

export const getComplaintsOfOfficer = async (params = {}) => {
  return instance.get("/grievances/officer", { params }).then((res) => res.data);
};

export const getComplaintById = async ({ id, params = {} }) => {
  return instance.get(`/grievances/all/${id}`, { params }).then((res) => res.data);
};

export const getComplaintsForCCEandAdmin = async (params = {}) => {
  return instance.get("/grievances/all", { params }).then((res) => res.data);
};

export const uploadGeotaggedImage = async ({ id, formData }) => {
  return instance.post(`/grievances/officer/${id}/geotagged-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data);
};

export const getComplaintByIdForOfficer = async ({ id, params = {} }) => {
  return instance.get(`/grievances/officer/detail/${id}`, { params }).then((res) => res.data);
};

export const assignOfficer = async ({ id, assignedOfficer }) => {
  return instance.patch(`/grievances/officer/${id}/transfer`, { assignedOfficer }).then((res) => res.data);
};

export const updateComplaintStatus = async ({ id, status }) => {
  return instance.patch(`/grievances/officer/${id}/status`, { status }).then((res) => res.data);
};

export const updateComplaintPriority = async ({ id, assignedPriority }) => {
  return instance.patch(`/grievances/officer/${id}/priority`, { assignedPriority }).then((res) => res.data);
};


export const postComplaint = async (body)=> {
  return instance.post("/grievances/officer/create", body);
}