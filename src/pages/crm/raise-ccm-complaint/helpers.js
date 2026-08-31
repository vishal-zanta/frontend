import { getFormsFields } from "@/lib/idb";
import moment from "moment";

export const getFormData = (data, attachments = []) => {
  const formData = new FormData();

  if (data.channel) {
    formData.append("channel", data.channel);
  }

  // Flatten nested fields to match Postman format
  if (data.citizenInfo.fullName)
    formData.append("citizenInfo[fullName]", data.citizenInfo.fullName);
  formData.append("citizenInfo[mobile]", data.citizenInfo.mobile);
  if (data.citizenInfo.alternateMobile)
    formData.append(
      "citizenInfo[alternateMobile]",
      data.citizenInfo.alternateMobile,
    );
  if (data.citizenInfo.email)
    formData.append("citizenInfo[email]", data.citizenInfo.email);
  if (data.citizenInfo.preferredLanguage)
    formData.append(
      "citizenInfo[preferredLanguage]",
      data.citizenInfo.preferredLanguage,
    );

  formData.append("classification[subService]", data.classification.subService);
  formData.append("classification[nature]", data.classification.nature);
  formData.append("classification[subject]", data.classification.subject);
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

  if (data.evidence.details)
    formData.append("evidence[details]", data.evidence.details);
  if (data.evidence.occurrenceDate)
    formData.append("evidence[occurrenceDate]", data.evidence.occurrenceDate);
  formData.append("evidence[frequency]", data.evidence.frequency);

  formData.append(
    "impact[affectedBeneficiary]",
    data.impact.affectedBeneficiary,
  );
  formData.append(
    "impact[vulnerability[seniorCitizen]]",
    String(data.impact.vulnerability.seniorCitizen ?? false),
  );
  formData.append(
    "impact[vulnerability[woman]]",
    String(data.impact.vulnerability.woman ?? false),
  );
  formData.append(
    "impact[vulnerability[personWithDisability]]",
    String(data.impact.vulnerability.personWithDisability ?? false),
  );
  formData.append(
    "impact[vulnerability[economicallyWeakerSection]]",
    String(data.impact.vulnerability.economicallyWeakerSection ?? false),
  );

  if (data.address.state) formData.append("address[state]", data.address.state);
  if (data.address.district)
    formData.append("address[district]", data.address.district);
  if (data.address.subdivision)
    formData.append("address[subdivision]", data.address.subdivision);
  if (data.address.villageOrWard)
    formData.append("address[villageOrWard]", data.address.villageOrWard);
  if (data.address.pinCode)
    formData.append("address[pinCode]", data.address.pinCode);
  if (data.address.landmark)
    formData.append("address[landmark]", data.address.landmark);

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
