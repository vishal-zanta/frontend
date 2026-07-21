import instance from "../../../lib/axios";

// ---- services----
export const getServices = async (params = {}) => {
  return instance.get("/services", { params });
};

export const postService = async (service) => {
  return instance.post(`/services`, service);
};

export const putService = async ({ serviceId, service }) => {
  return instance.put(`/services/${serviceId}`, service);
};

export const deleteService = async (serviceId) => {
  return instance.delete(`/services/${serviceId}`);
};

// ----sub services----
export const getSubservices = async (params = {}) => {
  return instance.get("/services/sub", { params });
};

export const postSubservice = async (subservice) => {
  return instance.post(`/services/sub`, subservice);
};

export const putSubservice = async ({ subserviceId, subservice }) => {
  return instance.put(`/services/sub/${subserviceId}`, subservice);
};

export const deleteSubservice = async (subserviceId) => {
  return instance.delete(`/services/sub/${subserviceId}`);
};

// ----complaint-sources----
export const getComplaintSources = async (params = {}) => {
  return instance.get("/complaint-sources", { params });
};

export const postComplaintSource = async (source) => {
  return instance.post(`/complaint-sources`, source);
};

export const putComplaintSource = async ({ sourceId, source }) => {
  return instance.put(`/complaint-sources/${sourceId}`, source);
};

export const deleteComplaintSource = async (sourceId) => {
  return instance.delete(`/complaint-sources/${sourceId}`);
};

// ----demography----
export const getDemographics = async (params = {}) => {
  return instance.get("/demography", { params });
};

export const postDemographic = async (demographic) => {
  return instance.post(`/demography`, demographic);
};

export const putDemographic = async ({ demographicId, demographic }) => {
  return instance.put(`/demography/${demographicId}`, demographic);
};

export const deleteDemographic = async (demographicId) => {
  return instance.delete(`/demography/${demographicId}`);
};

// ----ulb----
export const getUlbs = async (params = {}) => {
  return instance.get("/demography/ulb", { params });
};

export const postUlb = async (ulb) => {
  return instance.post(`/demography/ulb`, ulb);
};

export const putUlb = async ({ ulbId, ulb }) => {
  return instance.put(`/demography/ulb/${ulbId}`, ulb);
};

export const deleteUlb = async (ulbId) => {
  return instance.delete(`/demography/ulb/${ulbId}`);
};

// ---- grievance-nature options ----
export const getOptions = async (params = {}) => {
  return instance.get("/options", { params });
};

export const getOptionTypes = async () => {
  return instance.get("/options/types");
};

export const postOption = async (option) => {
  return instance.post("/options", option);
};

export const putOption = async ({ optionId, option }) => {
  return instance.put(`/options/${optionId}`, option);
};

export const deleteOption = async (optionId) => {
  return instance.delete(`/options/${optionId}`);
};

// ---- departments ----
export const getDepartments = async (params = {}) => {
  return instance.get("/departments", { params });
};

export const postDepartment = async (department) => {
  return instance.post("/departments", department);
};

export const putDepartment = async ({ departmentId, department }) => {
  return instance.put(`/departments/${departmentId}`, department);
};

export const deleteDepartment = async (departmentId) => {
  return instance.delete(`/departments/${departmentId}`);
};


