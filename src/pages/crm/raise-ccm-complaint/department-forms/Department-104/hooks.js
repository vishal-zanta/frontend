import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export const post1Api = async () => {
  const res = await axios.post(
    "http://bihargrhelp.piramalswasthya.org/egov-mdms-service/v1/_search?tenantId=bh",
    {
      MdmsCriteria: {
        tenantId: "bh",
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "GenderType",
              },
              {
                name: "ComplainantType",
              },
              {
                name: "InstitutionType",
              },
              {
                name: "InstitutionName",
              },
            ],
          },
          {
            moduleName: "RAINMAKER-PGR",
            masterDetails: [
              {
                name: "ServiceDefs",
              },
              {
                name: "GrievanceType",
              },
              {
                name: "GrievanceSubType",
              },
            ],
          },
        ],
      },
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1786000572894|en_IN",
      },
    }
  );
  return res?.data;
};

export const post2Api = async () => {
  const res = await axios.post(
    "http://bihargrhelp.piramalswasthya.org/egov-mdms-service/v1/_search?tenantId=bh.health",
    {
      MdmsCriteria: {
        tenantId: "bh.health",
        moduleDetails: [
          {
            moduleName: "egov-location",
            masterDetails: [
              {
                name: "TenantBoundary",
              },
            ],
          },
        ],
      },
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1785999777994|en_IN",
      },
    }
  );
  return res?.data;
};

export const usePostPreCall = () => {
  const mutation1 = useMutation({
    mutationFn: post1Api,
  });

  const mutation2 = useMutation({
    mutationFn: post2Api,
  });

  useEffect(() => {
    // mutation1.mutate();
    // mutation2.mutate();
  }, []);

  return {
    data1: mutation1.data,
    data2: mutation2.data,
    isLoading1: mutation1.isPending || mutation1.isLoading,
    isLoading2: mutation2.isPending || mutation2.isLoading,
    isLoading:
      mutation1.isPending ||
      mutation1.isLoading ||
      mutation2.isPending ||
      mutation2.isLoading,
    isError1: mutation1.isError,
    isError2: mutation2.isError,
    isError: mutation1.isError || mutation2.isError,
    error1: mutation1.error,
    error2: mutation2.error,
    error: mutation1.error || mutation2.error,
    mutation1,
    mutation2,
  };
};
