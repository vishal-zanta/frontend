import moment from "moment";

export const getMappedMasterData = (res) => {
  let obj = {
    institutionName: (res?.["common-masters"]?.["InstitutionName"] || [])
      .filter((v) => v.active == true)
      .map((v) => ({
        label: v.name,
        value: v.name,
        labelHindi: v?.nameHindi || v.name,
      })),
    institutionType: (res?.["common-masters"]?.["InstitutionType"] || [])
      .filter((v) => v.active == true)
      .map((v) => ({
        label: v.name,
        value: v.name,
        labelHindi: v?.nameHindi || v.name,
      })),
    gender: (res?.["common-masters"]?.["GenderType"] || [])
      .filter((v) => v.active == true)
      .map((v) => ({
        label: v.name,
        value: v.code,
        labelHindi: v?.nameHindi || v.name,
      })),
    complainantType: (res?.["common-masters"]?.["ComplainantType"] || [])
      .filter((v) => v.active == true)
      .map((v) => ({
        label: v.name,
        value: v.name,
        labelHindi: v?.nameHindi || v.name,
      })),
    grievanceType: (res?.["RAINMAKER-PGR"]?.["ServiceDefs"] || [])
      .filter((v) => v.active == true)
      .map((v) => ({
        label: v.name,
        value: v.name,
        subType: v.serviceCode,
        labelHindi: v?.nameHindi || v.name,
      })),
  };

  return obj;
};

export const getDistrictMappedData = (res) => {
  let nested =
    res?.MdmsRes?.["egov-location"]?.["TenantBoundary"]?.[1]?.boundary
      ?.children || [];
  let obj = {
    division: nested.map((v) => ({
      label: v.name,
      value: v.name,
      code: v.code,
      labelHindi: v?.nameHindi || v.name,
    })),
    district: nested
      .map((division) => {
        return (division?.children || []).map((district) => ({
          label: district.name,
          value: district.name,
          division: division.name,
          labelHindi: district?.nameHindi || district.name,
        }));
      })
      .flat(4),
    block: nested
      .map((division) => {
        return (division?.children || []).map((district) => {
          return (district?.children || []).map((block) => ({
            label: block.name,
            value: block.name,
            district: district.name,
            division: division.name,
            labelHindi: block?.nameHindi || block.name,
          }));
        });
      })
      .flat(4),
    village: nested
      .map((division) => {
        return (division?.children || []).map((district) => {
          return (district?.children || []).map((block) => {
            return (block?.children || []).map((village) => ({
              label: village.name,
              value: village.name,
              block: block.name,
              district: district.name,
              division: division.name,
              labelHindi: village?.nameHindi || village.name,
            }));
          });
        });
      })
      .flat(5),
  };

  return obj;
};

export const getFinalFormData = (data, fields, departmentCode="") => {
  let updatedData = { ...data };

  updatedData.dateOfIncident = String(
  moment(updatedData.dateOfIncident).valueOf()
);
  updatedData.serviceCode = (fields?.grievanceType || []).find(
    (o) => o.value === data?.grievanceType,
  )?.subType;
  const division = (fields?.district || []).find(
    (o) => o.value === data?.address?.district,
  )?.division;
  const divisionName =
    (fields?.division || []).find((o) => o.value === division)?.label || "";

  updatedData.address.division = String(divisionName).toUpperCase();
  updatedData.address.region = String(divisionName).toUpperCase();
  updatedData.address.locality.code = String(divisionName).toUpperCase();
  updatedData.address.locality.name = String(divisionName);

  let payload = {
    departmentCode,
    mobile : updatedData.citizen?.mobileNumber,
    departmentPayload: updatedData

  }
  return payload;
};
