import React from "react";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import RhfWrapper from "@/components/RhfWrapper";
import Form from "./components/Form";
import { useGetFoodOptions } from "./hooks";
import validationSchema from "./schema";
import { getFinalFoodData } from "./helpers";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  const {
    options,
    error,
    loading: isOptionsLoading,
  } = useGetFoodOptions(selectedDept);

  return (
    <LoaderErrWrapper
      isLoading={isOptionsLoading}
      error={error}
      loadingText={t("Loading form options...", "फ़ॉर्म विकल्प लोड हो रहे हैं...")}
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
