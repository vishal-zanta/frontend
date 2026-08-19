import moment from "moment";
import { finalMappedDataOfExternalDept } from "../../helpers";

export function generateUCHId() {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(1000000 + Math.random() * 9000000);

  return `UCH-${year}-${randomNumber}`;
}

export const getFinalData = (data = {}, departmentCode = "EDUCATION") => {
  const departmentPayload = {
    externalRef: generateUCHId(),
    type: data?.type || "COMPLAINT",
    categoryId: Number(data?.categoryId) || 0,
    // categoryOther : "",
    complaint: String(data?.complaint || ""),
    complainant: {
      name: String(data?.complainant?.name || ""),
      mobile: String(data?.complainant?.mobile || ""),
      shareNumberWithOfficer: Boolean(
        data?.complainant?.shareNumberWithOfficer,
      ),
    },
    location: {
      districtCode: Number(data?.location?.districtCode) || 0,
      blockCode: Number(data?.location?.blockCode) || 0,
      clusterCode: Number(data?.location?.clusterCode) || 0,
      panchayatCode: Number(data?.location?.panchayatCode) || 0,
      villageCode: Number(data?.location?.villageCode) || 0,
      schoolCode: Number(data?.location?.schoolCode) || 0,
      teacherCode: Number(data?.location?.teacherCode) || 0,
    },
    accused: {
      name: String(data?.accused?.name || ""),
      designation: String(data?.accused?.designation || ""),
    },
    source: data?.source || "HELPLINE",
    registeredAt:
      data?.registeredAt && moment(data.registeredAt).isValid()
        ? moment(data.registeredAt).format("YYYY-MM-DDTHH:mm:ssZ")
        : moment().format("YYYY-MM-DDTHH:mm:ssZ"),
  };

  return finalMappedDataOfExternalDept(
    departmentCode,
    departmentPayload.complainant.mobile,
    departmentPayload,
  );
};

