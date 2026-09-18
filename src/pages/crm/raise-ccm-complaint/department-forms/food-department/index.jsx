import React from "react";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import RhfWrapper from "@/components/RhfWrapper";
import Form from "./components/Form";
import { useGetFoodOptions } from "./hooks";
import validationSchema from "./schema";
import { getFinalFoodData } from "./helpers";

const defaultValues = {
  name: "",
  mobileNo: "",
  typeId: "",
  categoryId: "",
  stateId: "10",
  districtId: "",
  blockId: "",
  panchayatId: "",
  villageId: "",
  address: "",
  grievancesDescription: "",
};

const FoodDepartmentForm = ({ onSuccess, isLoading, selectedDept = "FOOD" }) => {
  const {
    options,
    error,
    loading: isOptionsLoading,
  } = useGetFoodOptions(selectedDept);

  return (
    <LoaderErrWrapper
      isLoading={isOptionsLoading}
      error={error}
      loadingText="Loading form options..."
    >
      <RhfWrapper
        initialValues={defaultValues}
        onSubmit={(data) => {
          const finalData = getFinalFoodData(data, selectedDept);
          console.log("Food Grievance Data:", data, finalData);
          if (onSuccess) {
            onSuccess(finalData);
          }
        }}
        onError={(err) => {
          console.log("Food Form Error:", err);
        }}
        isValidation={true}
        validationSchema={validationSchema}
      >
        <Form options={options} isLoading={isLoading} />
      </RhfWrapper>
    </LoaderErrWrapper>
  );
};

export default React.memo(FoodDepartmentForm);
