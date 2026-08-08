import Department104Form from "../pages/crm/raise-ccm-complaint/department-forms/health-department";
import HealthDepartmentListCard from "@/components/complaints/department-list/health-department"
import HealthDepartmentViewCard from "@/components/complaints/department-view/health-department"


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
];
