import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";
import { MAX_LIMIT } from "@/utils/constants";
import {
  useGetComplaintSources,
  useGetOptions,
  useGetDepartments,
} from "../../admin/master-data/hooks";
import {
  getDistricts,
  getBlocks,
  getPanchayats,
  getThanas,
} from "@/api/address.api";
import {
  getDivisions,
  getDistrictsByDivision,
  getSubdivisionsByDistrict,
  getBlocksBySubdivision,
} from "@/api/location.api";

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

  const allDepartments = departmentsData?.data?.data?.docs ?? [];
  const allNatures = naturesData?.data?.data?.docs ?? [];
  let allChannels = complaintSourcesData?.data?.data?.docs ?? [];

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

  return {
    departmentOptions,
    departmentsLoading,
    naturesLoading,
    grievanceNatureOptions,
    affectedBeneficiaryOptions,
    allChannels,
    complaintSourcesLoading,
  };
};

export const useGetAddressFields = (
  {
    districtId = "",
    blockId = "",
    lang = "en",
    enabled = true,
  } = {},
  { isValueId = true } = {},
) => {
  const CACHE_TIME = 5 * 60 * 1000;
  const {
    data: districtsData,
    isLoading: isDistrictsLoading,
    error: districtsError,
    refetch: refetchDistricts,
  } = useQuery({
    queryKey: ["address-districts"],
    queryFn: () => getDistricts(),
    enabled,
    gcTime: CACHE_TIME,
    staleTime: CACHE_TIME,
  });

  const {
    data: blocksData,
    isLoading: isBlocksLoading,
    error: blocksError,
    refetch: refetchBlocks,
  } = useQuery({
    queryKey: ["address-blocks", districtId],
    queryFn: () => getBlocks(districtId),
    enabled: Boolean(enabled && districtId),
    gcTime: CACHE_TIME,
    staleTime: CACHE_TIME,
  });

  const {
    data: panchayatsData,
    isLoading: isPanchayatsLoading,
    error: panchayatsError,
    refetch: refetchPanchayats,
  } = useQuery({
    queryKey: ["address-panchayats", blockId],
    queryFn: () => getPanchayats(blockId),
    enabled: Boolean(enabled && blockId),
    gcTime: CACHE_TIME,
    staleTime: CACHE_TIME,
  });

  const {
    data: thanasData,
    isLoading: isThanasLoading,
    error: thanasError,
    refetch: refetchThanas,
  } = useQuery({
    queryKey: ["address-thanas", blockId],
    queryFn: () => getThanas(blockId),
    enabled: Boolean(enabled && blockId),
    gcTime: CACHE_TIME,
    staleTime: CACHE_TIME,
  });

  const getList = (res) => {
    if (Array.isArray(res?.data?.data?.docs)) return res.data.data.docs;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.data?.docs)) return res.data.docs;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  };

  const districts = getList(districtsData);
  const blocks = getList(blocksData);
  const panchayats = getList(panchayatsData);
  const thanas = getList(thanasData);
  const mapOptions = (arr = []) => {
    return arr.map((item) => ({
      label: lang === "hi" && item.name_local ? item.name_local : item.name_en || item.name || item.title || "",
      value: isValueId
        ? item._id
        : lang === "hi" && item.name_local
          ? item.name_local
          : item.name_en || item.name || item.title || "",
      raw: item,
    }));
  };

  const districtOptions = mapOptions(districts);
  const blockOptions = mapOptions(blocks);
  const panchayatOptions = mapOptions(panchayats);
  const thanaOptions = mapOptions(thanas);

  return {
    districtsData,
    blocksData,
    panchayatsData,
    thanasData,

    districts,
    blocks,
    panchayats,
    thanas,

    districtOptions,
    blockOptions,
    panchayatOptions,
    thanaOptions,

    isDistrictsLoading,
    isBlocksLoading,
    isPanchayatsLoading,
    isThanasLoading,
    isLoading:
      isDistrictsLoading ||
      isBlocksLoading ||
      isPanchayatsLoading ||
      isThanasLoading,

    districtsError,
    blocksError,
    panchayatsError,
    thanasError,

    refetchDistricts,
    refetchBlocks,
    refetchPanchayats,
    refetchThanas,
  };
};

export const useClearAddressFields = ({
  control,
  prefix,
  setValue,
}) => {
  const district = useWatch({
    control,
    name: `${prefix}.district`,
  });

  const subdivision = useWatch({
    control,
    name: `${prefix}.subdivision`,
  });

  const prevDistrictRef = useRef(district);
  const prevSubdivisionRef = useRef(subdivision);

  // When district changes, clear subdivision, panchayat, and thana
  useEffect(() => {
    if (
      prevDistrictRef.current !== undefined &&
      prevDistrictRef.current !== district
    ) {
      setValue(`${prefix}.subdivision`, "");
      setValue(`${prefix}.panchayat`, "");
      setValue(`${prefix}.thana`, "");
    }
    prevDistrictRef.current = district;
  }, [district, prefix, setValue]);

  // When subdivision changes, clear panchayat and thana
  useEffect(() => {
    if (
      prevSubdivisionRef.current !== undefined &&
      prevSubdivisionRef.current !== subdivision
    ) {
      setValue(`${prefix}.panchayat`, "");
      setValue(`${prefix}.thana`, "");
    }
    prevSubdivisionRef.current = subdivision;
  }, [subdivision, prefix, setValue]);
};

// Location of Occurrence hooks

export const useGetLocationAddressFields = (
  {
    divisionId = "",
    districtId = "",
    subdivisionId = "",
    blockId = "",
    lang = "en",
    enabled = true,
  } = {},
  { isValueId = true } = {},
) => {
  const CACHE_TIME = 5 * 60 * 1000;

  const {
    data: divisionsData,
    isLoading: isDivisionsLoading,
    error: divisionsError,
  } = useQuery({
    queryKey: ["divisions"],
    queryFn: () => getDivisions(),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });

  const {
    data: districtsData,
    isLoading: isDistrictsLoading,
    error: districtsError,
  } = useQuery({
    queryKey: ["districtsByDivision", divisionId],
    queryFn: () => getDistrictsByDivision(divisionId),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: Boolean(divisionId) && enabled,
  });

  const {
    data: subdivisionsData,
    isLoading: isSubdivisionsLoading,
    error: subdivisionsError,
  } = useQuery({
    queryKey: ["subdivisionsByDistrict", districtId],
    queryFn: () => getSubdivisionsByDistrict(districtId),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: Boolean(districtId) && enabled,
  });

  const {
    data: blocksData,
    isLoading: isBlocksLoading,
    error: blocksError,
  } = useQuery({
    queryKey: ["blocksBySubdivision", subdivisionId],
    queryFn: () => getBlocksBySubdivision(subdivisionId),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: Boolean(subdivisionId) && enabled,
  });

  const {
    data: panchayatsData,
    isLoading: isPanchayatsLoading,
    error: panchayatsError,
  } = useQuery({
    queryKey: ["panchayats", blockId],
    queryFn: () => getPanchayats(blockId),
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: Boolean(blockId) && enabled,
  });

  const getList = (res) => {
    if (Array.isArray(res?.data?.data?.docs)) return res.data.data.docs;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.data?.docs)) return res.data.docs;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  };

  const divisions = getList(divisionsData);
  const districts = getList(districtsData);
  const subdivisions = getList(subdivisionsData);
  const blocks = getList(blocksData);
  const panchayats = getList(panchayatsData);

  const mapOptions = (arr = []) => {
    return arr.map((item) => ({
      label: lang === "hi" && item.name_local ? item.name_local : item.name_en || item.name || item.title || "",
      value: isValueId
        ? item._id
        : lang === "hi" && item.name_local
          ? item.name_local
          : item.name_en || item.name || item.title || "",
      raw: item,
    }));
  };

  const divisionOptions = mapOptions(divisions);
  const districtOptions = mapOptions(districts);
  const subdivisionOptions = mapOptions(subdivisions);
  const blockOptions = mapOptions(blocks);
  const panchayatOptions = mapOptions(panchayats);

  return {
    divisionsData,
    districtsData,
    subdivisionsData,
    blocksData,
    panchayatsData,

    divisions,
    districts,
    subdivisions,
    blocks,
    panchayats,

    divisionOptions,
    districtOptions,
    subdivisionOptions,
    blockOptions,
    panchayatOptions,

    isDivisionsLoading,
    isDistrictsLoading,
    isSubdivisionsLoading,
    isBlocksLoading,
    isPanchayatsLoading,

    divisionsError,
    districtsError,
    subdivisionsError,
    blocksError,
    panchayatsError,
  };
};

export const useClearLocationFields = ({
  control,
  setValue,
}) => {
  const division = useWatch({
    control,
    name: "location.division",
  });

  const district = useWatch({
    control,
    name: "location.district",
  });

  const subdivision = useWatch({
    control,
    name: "location.subdivision",
  });

  const block = useWatch({
    control,
    name: "location.block",
  });

  const prevDivisionRef = useRef(division);
  const prevDistrictRef = useRef(district);
  const prevSubdivisionRef = useRef(subdivision);
  const prevBlockRef = useRef(block);

  // When division changes, clear district, subdivision, block, panchayat
  useEffect(() => {
    if (
      prevDivisionRef.current !== undefined &&
      prevDivisionRef.current !== division
    ) {
      setValue("location.district", "");
      setValue("location.subdivision", "");
      setValue("location.block", "");
      setValue("location.panchayat", "");
    }
    prevDivisionRef.current = division;
  }, [division, setValue]);

  // When district changes, clear subdivision, block, panchayat
  useEffect(() => {
    if (
      prevDistrictRef.current !== undefined &&
      prevDistrictRef.current !== district
    ) {
      setValue("location.subdivision", "");
      setValue("location.block", "");
      setValue("location.panchayat", "");
    }
    prevDistrictRef.current = district;
  }, [district, setValue]);

  // When subdivision changes, clear block, panchayat
  useEffect(() => {
    if (
      prevSubdivisionRef.current !== undefined &&
      prevSubdivisionRef.current !== subdivision
    ) {
      setValue("location.block", "");
      setValue("location.panchayat", "");
    }
    prevSubdivisionRef.current = subdivision;
  }, [subdivision, setValue]);

  // When block changes, clear panchayat
  useEffect(() => {
    if (
      prevBlockRef.current !== undefined &&
      prevBlockRef.current !== block
    ) {
      setValue("location.panchayat", "");
    }
    prevBlockRef.current = block;
  }, [block, setValue]);
};
