import RhfWrapper from "@/components/RhfWrapper";
import React from "react";
import Form from "./components/Form";
import schema from "./schema";
import { convertJSONToFormdata } from "../../helpers";

let defaultValues = {
  dateOfIncident: "",
  locationOfIncident: "",
  complainantName: "",
  complainantMobile: "",
  gender: "",
  complainantType: "",
  grievanceType: "",
  grievanceSubType: "",
  district: "",
  block: "",
  village: "",
  institutionType: "",
  institutionName: "",
  grievanceAgainstWhom: "",
  briefOfGrievance: "",
  uploadRelatedDocument: null,
  //   description: "",
  //   additionalDetail: {},
  //   source: "",
  //   address: {
  //     state: "",
  //     division: "",
  //     region: "",
  //     district: "",
  //     block: "",
  //     village: "",
  //     locality: {
  //       code: "",
  //       name: "",
  //     },
  //     geoLocation: {},
  //   },
};
const index = ({ onSuccess }) => {
    
  return (
    <RhfWrapper
      initialValues={defaultValues}
      isValidation
      validationSchema={schema}
      validationOn="onChange"
      onSubmit={(data) => {
        onSuccess(convertJSONToFormdata(data));
      }}
      className="!space-y-4 !sm:space-y-6"
    >
      <Form />
    </RhfWrapper>
  );
};

export default React.memo(index);
