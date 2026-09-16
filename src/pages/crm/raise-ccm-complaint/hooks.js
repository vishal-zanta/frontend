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
  getVillages,
  getUlbs,
  getWards,
  getThanas,
} from "@/api/address.api";

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
    subdivisionId = "",
    panchayatId = "",
    ulbId = "",
    urbanPanchayatId = "",
    lang = "en",
    enabled = true,
    isUrban = false,
  } = {},
  { isValueId = true } = {},
) => {
  const effectiveBlockId = blockId || subdivisionId || "";
  const effectiveUlbId = ulbId || urbanPanchayatId || "";
  const CACHE_TIME = 5 * 60 * 1000;

  // 1) Districts: GET /address/districts
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

  // 2) Subdivision / Block: GET /address/districts/:districtId/blocks
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

  // 3) Panchayat: GET /address/blocks/:blockId/panchayats
  const {
    data: panchayatsData,
    isLoading: isPanchayatsLoading,
    error: panchayatsError,
    refetch: refetchPanchayats,
  } = useQuery({
    queryKey: ["address-panchayats", effectiveBlockId],
    queryFn: () => getPanchayats(effectiveBlockId),
    enabled: Boolean(enabled && effectiveBlockId) && !isUrban,
    gcTime: CACHE_TIME,
    staleTime: CACHE_TIME,
  });

  // 4) Village: GET /address/panchayats/:panchayatId/villages
  const {
    data: villagesData,
    isLoading: isVillagesLoading,
    error: villagesError,
    refetch: refetchVillages,
  } = useQuery({
    queryKey: ["address-villages", panchayatId],
    queryFn: () => getVillages(panchayatId),
    enabled: Boolean(enabled && panchayatId) && !isUrban,
    gcTime: CACHE_TIME,
    staleTime: CACHE_TIME,
  });

  // 5) Urban Panchayat (ULBs): GET /address/districts/:districtId/ulbs
  const {
    data: ulbsData,
    isLoading: isUlbsLoading,
    error: ulbsError,
    refetch: refetchUlbs,
  } = useQuery({
    queryKey: ["address-ulbs", districtId],
    queryFn: () => getUlbs(districtId),
    enabled: Boolean(enabled && districtId) && isUrban,
    gcTime: CACHE_TIME,
    staleTime: CACHE_TIME,
  });

  // 6) Wards: GET /address/ulbs/:ulbId/wards
  const {
    data: wardsData,
    isLoading: isWardsLoading,
    error: wardsError,
    refetch: refetchWards,
  } = useQuery({
    queryKey: ["address-wards", effectiveUlbId],
    queryFn: () => getWards(effectiveUlbId),
    enabled: Boolean(enabled && effectiveUlbId) && isUrban,
    gcTime: CACHE_TIME,
    staleTime: CACHE_TIME,
  });

  // 7) Thanas: GET /address/districts/:districtId/thanas
  const {
    data: thanasData,
    isLoading: isThanasLoading,
    error: thanasError,
    refetch: refetchThanas,
  } = useQuery({
    queryKey: ["address-thanas", districtId],
    queryFn: () => getThanas(districtId),
    enabled: Boolean(enabled && districtId),
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
  const villages = getList(villagesData);
  const ulbs = getList(ulbsData);
  const wards = getList(wardsData);
  const thanas = getList(thanasData);

  const mapOptions = (arr = []) => {
    return arr.map((item) => ({
      label:
        lang === "hi" && item.name_local
          ? item.name_local
          : item.name_en || item.name || item.title || "",
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
  const villageOptions = mapOptions(villages);
  const urbanPanchayatOptions = mapOptions(ulbs);
  const wardOptions = mapOptions(wards);
  const thanaOptions = mapOptions(thanas);

  return {
    districtsData,
    blocksData,
    panchayatsData,
    villagesData,
    ulbsData,
    wardsData,
    thanasData,

    districts,
    blocks,
    panchayats,
    villages,
    ulbs,
    wards,
    thanas,

    districtOptions,
    blockOptions,
    subdivisionOptions: blockOptions,
    panchayatOptions,
    villageOptions,
    urbanPanchayatOptions,
    ulbOptions: urbanPanchayatOptions,
    wardOptions,
    thanaOptions,

    isDistrictsLoading,
    isBlocksLoading,
    isSubdivisionsLoading: isBlocksLoading,
    isPanchayatsLoading,
    isVillagesLoading,
    isUlbsLoading,
    isUrbanPanchayatsLoading: isUlbsLoading,
    isWardsLoading,
    isThanasLoading,
    isLoading:
      isDistrictsLoading ||
      isBlocksLoading ||
      isPanchayatsLoading ||
      isVillagesLoading ||
      isUlbsLoading ||
      isWardsLoading ||
      isThanasLoading,

    districtsError,
    blocksError,
    panchayatsError,
    villagesError,
    ulbsError,
    urbanPanchayatsError: ulbsError,
    wardsError,
    thanasError,

    refetchDistricts,
    refetchBlocks,
    refetchPanchayats,
    refetchVillages,
    refetchUlbs,
    refetchUrbanPanchayats: refetchUlbs,
    refetchWards,
    refetchThanas,
  };
};

export const useGetLocationAddressFields = useGetAddressFields;

export const useClearAddressFields = ({
  control,
  prefix,
  setValue,
}) => {
  const isUrban = useWatch({
    control,
    name: `${prefix}.isUrban`,
  });

  const district = useWatch({
    control,
    name: `${prefix}.district`,
  });

  const block = useWatch({
    control,
    name: `${prefix}.block`,
  });

  const panchayat = useWatch({
    control,
    name: `${prefix}.panchayat`,
  });

  const urbanPanchayat = useWatch({
    control,
    name: `${prefix}.urbanPanchayat`,
  });

  const prevIsUrbanRef = useRef(isUrban);
  const prevDistrictRef = useRef(district);
  const prevBlockRef = useRef(block);
  const prevPanchayatRef = useRef(panchayat);
  const prevUrbanPanchayatRef = useRef(urbanPanchayat);

  // When isUrban changes, clear corresponding fields
  useEffect(() => {
    if (
      prevIsUrbanRef.current !== undefined &&
      prevIsUrbanRef.current !== isUrban
    ) {
      if (isUrban) {
        setValue(`${prefix}.panchayat`, "");
        setValue(`${prefix}.village`, "");
      } else {
        setValue(`${prefix}.urbanPanchayat`, "");
        setValue(`${prefix}.ward`, "");
      }
    }
    prevIsUrbanRef.current = isUrban;
  }, [isUrban, prefix, setValue]);

  // When district changes, clear block, panchayat, thana, village, urbanPanchayat, and ward
  useEffect(() => {
    if (
      prevDistrictRef.current !== undefined &&
      prevDistrictRef.current !== district
    ) {
      setValue(`${prefix}.block`, "");
      setValue(`${prefix}.panchayat`, "");
      setValue(`${prefix}.thana`, "");
      setValue(`${prefix}.village`, "");
      setValue(`${prefix}.urbanPanchayat`, "");
      setValue(`${prefix}.ward`, "");
    }
    prevDistrictRef.current = district;
  }, [district, prefix, setValue]);

  // When block changes, clear panchayat and village
  useEffect(() => {
    if (
      prevBlockRef.current !== undefined &&
      prevBlockRef.current !== block
    ) {
      setValue(`${prefix}.panchayat`, "");
      setValue(`${prefix}.village`, "");
    }
    prevBlockRef.current = block;
  }, [block, prefix, setValue]);

  // When panchayat changes, clear village
  useEffect(() => {
    if (
      prevPanchayatRef.current !== undefined &&
      prevPanchayatRef.current !== panchayat
    ) {
      setValue(`${prefix}.village`, "");
    }
    prevPanchayatRef.current = panchayat;
  }, [panchayat, prefix, setValue]);

  // When urbanPanchayat changes, clear ward
  useEffect(() => {
    if (
      prevUrbanPanchayatRef.current !== undefined &&
      prevUrbanPanchayatRef.current !== urbanPanchayat
    ) {
      setValue(`${prefix}.ward`, "");
    }
    prevUrbanPanchayatRef.current = urbanPanchayat;
  }, [urbanPanchayat, prefix, setValue]);
};

export const useClearLocationFields = ({
  control,
  setValue,
}) => {
  return useClearAddressFields({
    control,
    prefix: "location",
    setValue,
  });
};
