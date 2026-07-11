import { useGetOptions, useGetSubservices } from "../../admin/master-data/hooks";

export const useRaiseComplaintData = (lang) => {
  const API_PARAMS = { page: 1, limit: 100 };

  const { data: subServicesData, isLoading: subServicesLoading } =
    useGetSubservices([], API_PARAMS, true);

  const { data: naturesData, isLoading: naturesLoading } =
    useGetOptions([], API_PARAMS);

  const allSubServices = subServicesData?.data?.data?.docs ?? [];
  const allNatures = naturesData?.data?.data?.docs ?? [];

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
    .filter((n) => n.type === "Public Impact")
    .map((n) => ({
      label: lang === "hi" && n.titleHindi ? n.titleHindi : n.title,
      value: n._id,
    }));

  return {
    subServicesLoading,
    naturesLoading,
    subServiceOptions,
    grievanceNatureOptions,
    frequencyOptions,
    affectedBeneficiaryOptions,
  };
};
