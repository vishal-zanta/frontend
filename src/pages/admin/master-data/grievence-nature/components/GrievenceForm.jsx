import RhfWrapper from "@/components/RhfWrapper";
import React from "react";
import { grievanceNatureSchema } from "../../schema";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";

const GrievenceForm = ({ initialValues, handleSubmit, typeOptions = [] }) => {
  return (
    <RhfWrapper
      initialValues={initialValues}
      isValidation
      validationSchema={grievanceNatureSchema}
      onSubmit={handleSubmit}
      className={"space-y-4"}
    >
       {/* Type - creatable single select from /options/types */}
      <RhfSelect
        name="type"
        label="Type"
        placeholder="Select or type a new type..."
        options={typeOptions}
        required
        isCreatable={true}
        isMultiple={false}
      />
      {/* Title */}
      <RhfInput
        name="title"
        label="Title"
        placeholder="e.g., Community, Family, Self"
        required
      />

     
    </RhfWrapper>
  );
};

export default GrievenceForm;
