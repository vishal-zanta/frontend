import Department104Form from "../pages/crm/raise-ccm-complaint/department-forms/health-department";
import HealthDepartmentListCard from "@/components/complaints/department-list/health-department"
import HealthDepartmentViewCard from "@/components/complaints/department-view/health-department"

import EducationDeptForm from "../pages/crm/raise-ccm-complaint/department-forms/education-department";
import EduDeptListCard from "@/components/complaints/department-list/education-department"
import EduDeptViewCard from "@/components/complaints/department-view/education-department"


//component = form component
// listComponent = track -complaints list component,
// viewComponent = view complaint component

export let departmentsList = [
  {
    id: 1,
    name: "CM Helpline",
    key: "cm-helpline",
    component: null,
    listComponent: null,
    viewComponent: null,
  },
  {
    id: 2,
    name: "Health Department",
    key: "HEALTH",
    component: Department104Form, // onSuccess(data : formData),
    listComponent: HealthDepartmentListCard,
    viewComponent: HealthDepartmentViewCard,
  },
  {
    id: 3,
    name: "Education Department",
    key: "Education",
    component: EducationDeptForm, // onSuccess(data : formData),
    listComponent: EduDeptListCard,
    viewComponent: EduDeptViewCard,
  },
];
