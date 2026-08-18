import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import React from "react";
import Form from "./components/Form";
import RhfWrapper from "@/components/RhfWrapper";
import {useGetFieldsOptions} from "./hooks";

const defaultValue = {
  externalRef: "UCH-2026-0001234",
  type: "COMPLAINT",
  categoryId: "",
  categoryOther: "",
  complaint:
    "",
  complainant: {
    name: "",
    mobile: "",
    shareNumberWithOfficer: false,
  },
  location: {
    districtCode: "",
    blockCode: "",
    clusterCode: "",
    panchayatCode: "",
    villageCode: "",
    schoolCode: "",
    teacherCode: "",
  },
  accused: {
    name: "",
    designation: "",
  },
  source: "",
  registeredAt: "",
};

const index = ({ onSuccess, isLoading }) => {
  const { fields, error, isLoading: isFieldsLoading } = useGetFieldsOptions();

  return (
    <LoaderErrWrapper
      isLoading={isFieldsLoading}
      error={error}
      loadingText="Loading form options..."
    >
      <RhfWrapper
        initialValues={defaultValue}
        onSubmit={(data) => {
          console.log("Education Grievance Data:", data);
        //   if (onSuccess) {
        //     onSuccess(data);
        //   }
        }}
        onError={(error) => {
          console.log("Form Error:", error);
        }}
      >
        <Form fields={fields} isLoading={isLoading} />
      </RhfWrapper>
    </LoaderErrWrapper>
  );
};

export default index;


/**
 * 
 * {
  externalRef: "UCH-2026-0001234",
  type: "COMPLAINT",
  categoryId: 112,
  categoryOther: "string",
  complaint:
    "The school has been closed for the last four days without notice.",
  complainant: {
    name: "Ramesh Kumar",
    mobile: "9876543210",
    shareNumberWithOfficer: false,
  },
  location: {
    districtCode: 1007,
    blockCode: 0,
    clusterCode: 0,
    panchayatCode: 0,
    villageCode: 0,
    schoolCode: 0,
    teacherCode: 0,
  },
  accused: {
    name: "string",
    designation: "string",
  },
  source: "HELPLINE",
  registeredAt: "2026-08-18T11:02:00+05:30",
};
 */