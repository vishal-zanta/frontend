import Department104Form from "../pages/crm/raise-ccm-complaint/department-forms/health-department";
import HealthDepartmentListCard from "@/components/complaints/department-list/health-department"
import HealthDepartmentViewCard from "@/components/complaints/department-view/health-department"

import EducationDeptForm from "../pages/crm/raise-ccm-complaint/department-forms/education-department";
import EduDeptListCard from "@/components/complaints/department-list/education-department"
import EduDeptViewCard from "@/components/complaints/department-view/education-department"
import FoodDepartment from "@/pages/crm/raise-ccm-complaint/department-forms/food-department";
import FoodDeptList from "@/components/complaints/department-list/food-department";
import FoodDeptView from "@/components/complaints/department-view/food-department";


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
