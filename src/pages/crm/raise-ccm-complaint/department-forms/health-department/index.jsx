import RhfWrapper from "@/components/RhfWrapper";
import React from "react";
import Form from "./components/Form";
import schema from "./schema";
import { convertJSONToFormdata } from "../../helpers";
import { usePostPreCall } from "./hooks";
import { getFinalFormData } from "./helpers";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

let defaultValues = {
  tenantId: "bh.health",
  dateOfIncident: "",
  locationOfIncident: "",
  // complainantName: "",
  // complainantMobile: "",
  // gender: "",
  complainantType: "",
  grievanceType: "",
  serviceCode: "",
  // grievanceSubType: "",
  // district: "",
  // block: "",
  // village: "",
  institutionType: "",
  institutionName: "",
  grievanceAgainstWhom: "",
  description: "",
  // uploadRelatedDocument: null,
  additionalDetail: {},
  source: "web",
  address: {
    state: "BH",
    division: "",
    region: "",
    district: "",
    block: "",
    village: "",
    locality: {
      code: "",
      name: "",
    },
    geoLocation: {},
  },
  citizen: {
    name: "",
    type: "CITIZEN",
    emailId: null,
    locale: null,
    mobileNumber: "",
    gender: "",
    roles: [
      {
        id: null,
        name: "Citizen",
        code: "CITIZEN",
        tenantId: "bh.health",
      },
    ],
    active: true,
    tenantId: "bh.health",
    permanentCity: null,
  },
};
const index = ({ onSuccess, isLoading }) => {
  const { fields, isLoading : isFormOptionsLoading, error } = usePostPreCall();
  console.log({ fields });

  return (
    <LoaderErrWrapper isLoading={isFormOptionsLoading} error={error}>
      <RhfWrapper
        initialValues={defaultValues}
        isValidation
        validationSchema={schema}
        validationOn="onChange"
        onSubmit={(data) => {
          const finalData = getFinalFormData(data, fields, "HEALTH");
          console.log({ data, finalData });
          onSuccess(finalData);
        }}
        className="!space-y-4 !sm:space-y-6"
      >
        <Form fields={fields} isLoading={isLoading} />
      </RhfWrapper>
    </LoaderErrWrapper>
  );
};

export default React.memo(index);
