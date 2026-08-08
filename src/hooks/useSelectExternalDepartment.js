import React, { useEffect, useState } from "react";
import { departmentsList } from "@/utils/departments";
import { useSearchParams } from "react-router-dom";

const useSelectExternalDepartment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const deptObj = departmentsList.find(
    (d) => d.key === searchParams.get("dept"),
  );
  const [dept, setDepState] = useState(
    deptObj ? deptObj?.key : departmentsList?.[0]?.key,
  );

  const updateDept = (key, clearAllOtherParams = false) => {
    if (clearAllOtherParams) {
      setSearchParams({ dept: key }, { replace: true });
      return;
    }
    const params = new URLSearchParams(searchParams);

    params.set("dept", key);

    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    if (searchParams.get("dept") && dept != searchParams.get("dept")) {
      setDept(searchParams.get("dept"));
    } else {
      !searchParams.get("dept") && updateDept(departmentsList?.[0]?.key);
    }
  }, [searchParams]);

  function setDept(key, clearAllOtherParams = false) {
    // if (clearAllParams) {
    //   setSearchParams(new URLSearchParams(), { replace: true });
    // }
    updateDept(key, clearAllOtherParams);
    setDepState(key);
  }
  const selectedDept = departmentsList.find((d) => d.key === dept);
  const isExternalDepartment = selectedDept?.key != departmentsList?.[0]?.key;
  //   console.log("Select dept Hook rerender", {
  //     dept,
  //     searchParams: searchParams.get("dept"),
  //   });
  return { dept, setDept, selectedDept, departmentsList, isExternalDepartment };
};

export default useSelectExternalDepartment;
