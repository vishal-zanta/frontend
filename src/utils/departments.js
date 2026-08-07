import Department104Form from "../pages/crm/raise-ccm-complaint/department-forms/Department-104";

//component = form component
// listComponent = track -complaints list component,
// viewComponent = view complaint component

export let departmentsList = [
  {
    id: 1,
    name: "CM Helpline",
    key: "cm-helpline",
    component: null,
        listComponent : null,
    viewComponent : null
  },
  {
    id: 2,
    name: "Department 104",
    key: "department-104",
    component: Department104Form, // onSuccess(data : formData),
    listComponent : null,
    viewComponent : null
  },
];
