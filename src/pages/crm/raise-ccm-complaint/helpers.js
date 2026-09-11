import { getFormsFields } from "@/lib/idb";
import moment from "moment";

export const getFormData = (data, attachments = [], extraObj= {}) => {
  const formData = new FormData();

  if (data.channel) {
    formData.append("channel", data.channel);
  }

  // Flatten nested fields to match Postman format
  if (data.citizenInfo.fullName)
    formData.append("citizenInfo[fullName]", data.citizenInfo.fullName);
  formData.append("citizenInfo[mobile]", "+91" + data.citizenInfo.mobile);
  if (data.citizenInfo.alternateMobile)
    formData.append(
      "citizenInfo[alternateMobile]",
      "+91" + data.citizenInfo.alternateMobile,
    );
  if (data.citizenInfo.email)
    formData.append("citizenInfo[email]", data.citizenInfo.email);
  // if (data.citizenInfo.preferredLanguage)
  //   formData.append(
  //     "citizenInfo[preferredLanguage]",
  //     data.citizenInfo.preferredLanguage,
  //   );

  const citizenAddr = data.citizenInfo?.address;
  if (citizenAddr) {
    if (citizenAddr.addressLine)
      formData.append(
        "citizenInfo[address][addressLine]",
        citizenAddr.addressLine,
      );
    if (citizenAddr.district)
      formData.append("citizenInfo[address][district]", citizenAddr.district);
    if (citizenAddr.subdivision)
      formData.append(
        "citizenInfo[address][subdivision]",
        citizenAddr.subdivision,
      );
    if (citizenAddr.panchayat)
      formData.append("citizenInfo[address][panchayat]", citizenAddr.panchayat);
    if (citizenAddr.thana)
      formData.append("citizenInfo[address][thana]", citizenAddr.thana);
    if (citizenAddr.pincode)
      formData.append("citizenInfo[address][pincode]", citizenAddr.pincode);
  }

  // formData.append("classification[subService]", data.classification.subService);
  formData.append("classification[service]", data.classification.service);
  formData.append("classification[department]", data.classification.department);


  formData.append("classification[nature]", data.classification.nature);
  if (data.classification.isSeasonal !== undefined) {
    formData.append(
      "classification[isSeasonal]",
      String(data.classification.isSeasonal ?? false),
    );
  }
  if (data.classification.seasonalType) {
    formData.append(
      "classification[seasonalType]",
      data.classification.seasonalType,
    );
  }

  if (data.evidence?.details)
    formData.append("evidence[details]", data.evidence.details);

  // formData.append(
  //   "impact[affectedBeneficiary]",
  //   data.impact.affectedBeneficiary,
  // );
  // formData.append(
  //   "impact[vulnerability[seniorCitizen]]",
  //   String(data.impact.vulnerability?.seniorCitizen ?? false),
  // );
  // formData.append(
  //   "impact[vulnerability[woman]]",
  //   String(data.impact.vulnerability?.woman ?? false),
  // );
  // formData.append(
  //   "impact[vulnerability[personWithDisability]]",
  //   String(data.impact.vulnerability?.personWithDisability ?? false),
  // );
  // formData.append(
  //   "impact[vulnerability[economicallyWeakerSection]]",
  //   String(data.impact.vulnerability?.economicallyWeakerSection ?? false),
  // );
  formData.append("impact", JSON.stringify({
    affectedBeneficiary: data.impact.affectedBeneficiary,
    vulnerability: {
      seniorCitizen: Boolean(data.impact.vulnerability?.seniorCitizen ?? false),
      woman: Boolean(data.impact.vulnerability?.woman ?? false),
      personWithDisability: Boolean(data.impact.vulnerability?.personWithDisability ?? false),
      economicallyWeakerSection: Boolean(data.impact.vulnerability?.economicallyWeakerSection ?? false)
    }

  }))

  formData.append(
    "communication[feedbackConsent]",
    String(data.communication?.feedbackConsent ?? false),
  );

  const addr = data.address;
  if (addr) {
    if (addr.addressLine)
      formData.append("address[addressLine]", addr.addressLine);
    if (addr.state)
      formData.append("address[state]", addr.state);
    if (addr.city)
      formData.append("address[city]", addr.city);
    if (addr.district)
      formData.append("address[district]", addr.district);
    if (addr.subdivision)
      formData.append("address[subdivision]", addr.subdivision);
    if (addr.panchayat)
      formData.append("address[panchayat]", addr.panchayat);
    if (addr.thana)
      formData.append("address[thana]", addr.thana);
    if (addr.pincode)
      formData.append("address[pincode]", addr.pincode);
  }

  if (typeof data.isCrpEqualPerAdd !== "undefined") {
    formData.append("isCrpEqualPerAdd", String(data.isCrpEqualPerAdd));
  }

  const loc = data.location;
  if (loc) {
    if (loc.division) formData.append("location[division]", loc.division);
    if (loc.district) formData.append("location[district]", loc.district);
    if (loc.subdivision)
      formData.append("location[subdivision]", loc.subdivision);
    if (loc.block) formData.append("location[block]", loc.block);
    if (loc.panchayat) formData.append("location[panchayat]", loc.panchayat);
    if (loc.pincode)
      formData.append("location[pincode]", loc.pincode || loc.pincode);
  }

  if(Object.keys(extraObj).length > 0){
    Object.entries(extraObj).forEach(([key, value]) => {
      value && formData.append(key, value);
    });
  }
  attachments.forEach((file) => formData.append("attachments[]", file));
  return formData;
};

export const convertJSONToFormdata = (data = {}) => {
  let formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    let modifiedValue = value;
    if (modifiedValue == null) {
      return;
    } else if (Array.isArray(modifiedValue)) {
      modifiedValue.forEach((item) => {
        formData.append(`${key}[]`, item);
      });
    } else if (
      typeof modifiedValue === "object" &&
      modifiedValue !== null &&
      !(modifiedValue instanceof File)
    ) {
      modifiedValue = JSON.stringify(modifiedValue);
    }
    formData.append(key, modifiedValue);
  });
  return formData;
};

export const checkIdbDataExpiry = async (departmentCode) => {
  const dataFromDb = await getFormsFields(departmentCode);
  const isExpired =
    dataFromDb?.cachedAt &&
    moment(dataFromDb.cachedAt).isValid() &&
    moment().diff(moment(dataFromDb.cachedAt), "hours") >= 24;

  return { dataFromDb, isExpired };
};

export const finalMappedDataOfExternalDept = (
  departmentCode,
  mobile,
  departmentPayload,
) => {
  return {
    departmentCode,
    mobile,
    departmentPayload,
  };
};
