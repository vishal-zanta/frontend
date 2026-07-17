import { useGetComplaintSources, useGetDemographics, useGetOptions, useGetSubservices } from "../../admin/master-data/hooks";

export const useRaiseComplaintData = (lang) => {
  const API_PARAMS = { page: 1, limit: 500, select : "title,titleHindi,name,nameHindi" };

  const { data: subServicesData, isLoading: subServicesLoading } =
    useGetSubservices([], API_PARAMS, true);

  const { data: naturesData, isLoading: naturesLoading } =
    useGetOptions([], API_PARAMS);

    const {data : complaintSourcesData , isLoading : complaintSourcesLoading} = useGetComplaintSources([API_PARAMS], API_PARAMS);

    const {data : demographicSourceData , isLoading : demographyLoading} = useGetDemographics([API_PARAMS], API_PARAMS);
    // const {data : demographicSourceData , isLoading : demographyLoading} = useGet([API_PARAMS], API_PARAMS);




  const allSubServices = subServicesData?.data?.data?.docs ?? [];
  const allNatures = naturesData?.data?.data?.docs ?? [];
  let allChannels = complaintSourcesData?.data?.data?.docs ?? [];
  let allDemography = demographicSourceData?.data?.data?.docs ?? [];
  

  // Filter grievance natures to only "grievanceNature" type
  const grievanceNatureOptions = allNatures
    .filter((n) => n.type === "Grievance Nature")
    .map((n) => ({
      label: lang === "hi" && n.titleHindi ? n.titleHindi : n.title,
      value: n._id,
    }));

  const subServiceOptions = allSubServices.map((s) => ({
    label: lang === "hi" && s.titleHindi ? s.titleHindi : s.title,
    value: s._id,
  }));

  const frequencyOptions = allNatures
    .filter((n) => n.type === "Evidence Frequency")
    .map((n) => ({
      label: lang === "hi" && n.titleHindi ? n.titleHindi : n.title,
      value: n._id,
    }));

  const affectedBeneficiaryOptions = allNatures
    .filter((n) => n.type === "Affected Beneficiaries")
    .map((n) => ({
      label: lang === "hi" && n.titleHindi ? n.titleHindi : n.title,
      value: n._id,
    }));

    allChannels = allChannels.map((v)=> ({
      label : v.title,
      value : v?._id
    })); 
    allDemography = allDemography.map((v)=> ({
      label :lang === "hi" && v.nameHindi ? v.nameHindi : v.name ,
      value : v._id
    }))

  return {
    subServicesLoading,
    naturesLoading,
    subServiceOptions,
    grievanceNatureOptions,
    frequencyOptions,
    affectedBeneficiaryOptions,
    allChannels,
    complaintSourcesLoading,
    allDemography,
    demographyLoading
  };
};
