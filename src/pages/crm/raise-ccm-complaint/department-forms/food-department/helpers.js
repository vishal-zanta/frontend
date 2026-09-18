export const getFinalFoodData = (data, departmentCode = "FOOD") => {
  const payload = {
    departmentCode,
    mobile: data.mobileNo,
    departmentPayload: {
      name: data.name,
      mobileNo: data.mobileNo,
      typeId: Number(data.typeId) || data.typeId,
      categoryId: Number(data.categoryId) || data.categoryId,
      stateId: Number(data.stateId) || 10,
      districtId: Number(data.districtId) || data.districtId,
      blockId: Number(data.blockId) || data.blockId,
      panchayatId: String(data.panchayatId || ""),
      villageId: String(data.villageId || ""),
      address: data.address || "",
      grievancesDescription: data.grievancesDescription || "",
    },
  };
  return payload;
};
