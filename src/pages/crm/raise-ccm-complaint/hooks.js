import { MAX_LIMIT } from "@/utils/constants";
import {
  useGetComplaintSources,
  useGetDemographics,
  useGetOptions,
  useGetDepartments,
} from "../../admin/master-data/hooks";

export const useRaiseComplaintData = (lang) => {
  const API_PARAMS = {
    page: 1,
    limit: MAX_LIMIT,
    select: "title,titleHindi,name,nameHindi",
  };

  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments([], API_PARAMS);

  const { data: naturesData, isLoading: naturesLoading } =
    useGetOptions([], API_PARAMS);

  const { data: complaintSourcesData, isLoading: complaintSourcesLoading } =
    useGetComplaintSources([API_PARAMS], API_PARAMS);

  const { data: demographicSourceData, isLoading: demographyLoading } =
    useGetDemographics([API_PARAMS], API_PARAMS);

  const allDepartments = departmentsData?.data?.data?.docs ?? [];
  const allNatures = naturesData?.data?.data?.docs ?? [];
  let allChannels = complaintSourcesData?.data?.data?.docs ?? [];
  let allDemography = demographicSourceData?.data?.data?.docs ?? [];

  const departmentOptions = allDepartments.map((d) => ({
    label:
      lang === "hi" && (d.titleHindi || d.nameHindi)
        ? d.titleHindi || d.nameHindi
        : d.title || d.name,
    value: d._id,
  }));

  // Filter grievance natures to only "grievanceNature" type
  const grievanceNatureOptions = allNatures
    .filter((n) => n.type === "Grievance Nature")
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

  allChannels = allChannels.map((v) => ({
    label: v.title,
    value: v?._id,
  }));
  allDemography = allDemography.map((v) => ({
    label: lang === "hi" && v.nameHindi ? v.nameHindi : v.name,
    value: v._id,
    name: v.name,
  }));

  return {
    departmentOptions,
    departmentsLoading,
    naturesLoading,
    grievanceNatureOptions,
    affectedBeneficiaryOptions,
    allChannels,
    complaintSourcesLoading,
    allDemography,
    demographyLoading,
  };
};
