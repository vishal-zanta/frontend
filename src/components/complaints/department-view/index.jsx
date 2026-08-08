import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getExternalComplaintsById } from "@/api/complaint.api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { ComplaintViewShimmer } from "../ComplaintDetailView";

const ExternalComplaintView = ({ selected, externalDeptProps }) => {
  const id = selected?._id || selected?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.EXTERNAL_COMPLAINTS, "detail", id],
    queryFn: () => getExternalComplaintsById(id),
    enabled: !!id,
  });

  const info = data?.data?.data;
 

  return (
    <LoaderErrWrapper
      customLoader={<ComplaintViewShimmer />}
      isLoading={isLoading}
      error={error}
    >
      {(() => {
        const ViewComponent = externalDeptProps?.selectedDept?.viewComponent;
        if (!ViewComponent) return null;
        return <ViewComponent data={info} />;
      })()}
    </LoaderErrWrapper>
  );
};

export default ExternalComplaintView;
