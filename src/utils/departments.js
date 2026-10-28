import Department104Form from "../pages/crm/raise-ccm-complaint/department-forms/health-department";
import HealthDepartmentListCard from "@/components/complaints/department-list/health-department"
import HealthDepartmentViewCard from "@/components/complaints/department-view/health-department"

import EducationDeptForm from "../pages/crm/raise-ccm-complaint/department-forms/education-department";
import EduDeptListCard from "@/components/complaints/department-list/education-department"
import EduDeptViewCard from "@/components/complaints/department-view/education-department"
import FoodDepartment from "@/pages/crm/raise-ccm-complaint/department-forms/food-department";
import FoodDeptList from "@/components/complaints/department-list/food-department";
import FoodDeptView from "@/components/complaints/department-view/food-department";


const resolveMultilingualLabel = (
  opt,
  t,
) => {
  if (!opt) return undefined;
  const en = opt.label || "";
  const hi = opt.labelHindi || opt.label || "";
  return t ? t(en, hi) : en;
};

//component = form component
// listComponent = track -complaints list component,
// viewComponent = view complaint component

export let departmentsList = [
  {
    id: 1,
    name: "CM Helpline",
    nameHindi: "मुख्यमंत्री हेल्पलाइन",
    key: "cm-helpline",
    isExternal: true,
    isHide: true,
    component: null,
    listComponent: null,
    viewComponent: null,
  },
  {
    id: 2,
    name: "Health Department",
    nameHindi: "स्वास्थ्य विभाग",
    key: "HEALTH",
    isExternal: true,
    component: Department104Form, // onSuccess(data : formData), isLoading, selectedDept
    listComponent: HealthDepartmentListCard, // data, onClick, isSelected
    viewComponent: HealthDepartmentViewCard, // data
    getTableRowData: (data, t, masterData) => {
      const payload = data?.departmentPayload || {};
      const address = payload?.address || {};
      const grievanceTypeMatch = masterData?.grievanceType?.find(
        (g) =>
          String(g.value) === String(payload?.grievanceType) ||
          String(g.subType) === String(payload?.serviceCode) ||
          String(g.label) === String(payload?.grievanceType),
      );
      const districtMatch = masterData?.district?.find(
        (d) =>
          String(d.value) === String(address?.district) ||
          String(d.code) === String(address?.district) ||
          String(d.label) === String(address?.district),
      );

      const serviceLabel =
        resolveMultilingualLabel(grievanceTypeMatch, t) ||
        payload?.grievanceType ||
        payload?.serviceCode ||
        "-";
      const districtLabel =
        resolveMultilingualLabel(districtMatch, t) ||
        address?.district ||
        "-";

      return {
        complaintNumber: data?.internalId || data?.externalComplaintId || data?._id || "-",
        nature: payload?.type || (t ? t("Grievance", "शिकायत") : "COMPLAINT"),
        district: districtLabel,
        department: t
          ? t("Health Department", "स्वास्थ्य विभाग")
          : "Health Department",
        service: serviceLabel,
        status: data?.status || "PENDING",
        raisedOn: data?.createdAt || payload?.dateOfIncident,
      };
    },
  },
  {
    id: 3,
    name: "Education Department",
    nameHindi: "शिक्षा विभाग",
    key: "EDUCATION",
    isExternal: true,
    component: EducationDeptForm, // onSuccess(data : formData),isLoading, selectedDept
    listComponent: EduDeptListCard,
    viewComponent: EduDeptViewCard,
    getTableRowData: (data, t, masterData) => {
      const payload = data?.departmentPayload || {};
      const location = payload?.location || {};
      const categoryMatch = masterData?.categoryId?.find(
        (c) => String(c.value) === String(payload?.categoryId),
      );
      const districtMatch = masterData?.districtCode?.find(
        (d) => String(d.value) === String(location?.districtCode),
      );
      const typeMatch = masterData?.type?.find(
        (v) => String(v.value) === String(payload?.type),
      );

      const categoryLabel =
        resolveMultilingualLabel(categoryMatch, t) ||
        payload?.categoryOther ||
        (payload?.categoryId ? `Category ${payload?.categoryId}` : "-");
      const districtLabel =
        resolveMultilingualLabel(districtMatch, t) ||
        (location?.districtCode ? String(location?.districtCode) : "-");
      const natureLabel =
        resolveMultilingualLabel(typeMatch, t) ||
        payload?.type ||
        (t ? t("Grievance", "शिकायत") : "COMPLAINT");

      return {
        complaintNumber: data?.internalId || data?.externalComplaintId || payload?.externalRef || data?._id || "-",
        nature: natureLabel,
        district: districtLabel,
        department: t
          ? t("Education Department", "शिक्षा विभाग")
          : "Education Department",
        service: categoryLabel,
        status: data?.status || "PENDING",
        raisedOn: data?.createdAt,
      };
    },
  },
  {
    id: 4,
    name: "Food & Consumer Protection Department",
    nameHindi: "खाद्य एवं उपभोक्ता संरक्षण विभाग",
    key: "FOOD",
    isExternal: true,
    component: FoodDepartment, // onSuccess(data : formData),isLoading, selectedDept
    listComponent: FoodDeptList,
    viewComponent: FoodDeptView,
    getTableRowData: (data, t, masterData) => {
      const payload = data?.departmentPayload || {};
      const typeMatch = masterData?.type?.find(
        (o) => String(o.value) === String(payload?.typeId),
      );
      const categoryMatch = masterData?.category?.find(
        (o) => String(o.value) === String(payload?.categoryId),
      );
      const districtMatch = masterData?.district?.find(
        (d) => String(d.value) === String(payload?.districtId),
      );

      const serviceLabel =
        resolveMultilingualLabel(typeMatch, t) ||
        resolveMultilingualLabel(categoryMatch, t) ||
        (payload?.typeId ? `Type ${payload?.typeId}` : "-");
      const districtLabel =
        resolveMultilingualLabel(districtMatch, t) ||
        (payload?.districtId
          ? String(payload?.districtId)
          : payload?.address || "-");

      return {
        complaintNumber: data?.internalId || data?.externalComplaintId || payload?.grievanceID || data?._id || "-",
        nature: t ? t("Grievance", "शिकायत") : "COMPLAINT",
        district: districtLabel,
        department: t
          ? t(
              "Food & Consumer Protection Department",
              "खाद्य एवं उपभोक्ता संरक्षण विभाग",
            )
          : "Food & Consumer Protection Department",
        service: serviceLabel,
        status: data?.status || payload?.status || "PENDING",
        raisedOn: data?.createdAt || data?.updatedAt,
      };
    },
  },
];

export const isExternalDepartment = (keyOrId) => {
  return departmentsList.some(
    (dept) => !dept.isHide && (dept.key === keyOrId || dept.id === keyOrId),
  );
};

export const getExternalDepartment = (keyOrId) => {
  return (
    departmentsList.find(
      (dept) => dept.key === keyOrId || dept.id === keyOrId,
    ) || null
  );
};
