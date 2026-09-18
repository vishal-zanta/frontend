import React, { useEffect, useMemo, useRef } from "react";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import { useGetServices } from "../../master-data/hooks";
import {
  useGetDistrictsList,
  useGetBlocksByDistricts,
  useGetPanchayatsByBlocks,
  useGetUlbsByDistricts,
  useGetWardsByUlbs,
} from "../hooks";
import { MAX_LIMIT } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

export default function OfficerTaggingFormFields({
  isEdit = false,
  userOptions = [],
  department,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-4",
}) {
  const { t, lang } = useLanguage();
  const { setValue, control } = useFormContext();

  const selectedOfficer = useWatch({ control, name: "officer" });
  const selectedDistricts = useWatch({ control, name: "districts" }) || [];
  const selectedAreaType = useWatch({ control, name: "areaType" }) || [];
  const selectedBlocks = useWatch({ control, name: "blocks" }) || [];
  const selectedPanchayats = useWatch({ control, name: "panchayats" }) || [];
  const selectedUrbanPanchayats =
    useWatch({ control, name: "urbanPanchayats" }) || [];
  const selectedWards = useWatch({ control, name: "wards" }) || [];

  const selectedOfficerObj = userOptions.find(
    (u) => u.value === selectedOfficer,
  );
  const officerUser = selectedOfficerObj?.apiData || {};

  const officerDept =
    department ||
    officerUser?.department ||
    officerUser?.roles?.find((r) => r?.department)?.department ||
    officerUser?.role?.department;

  const officerDeptId =
    typeof officerDept === "object" ? officerDept?._id : officerDept;

  // 1) Fetch Services for officer's department
  const {
    data: servicesData,
    isLoading: serviceLoading,
    isFetching: serviceFetching,
  } = useGetServices(
    [officerDeptId],
    {
      page: 1,
      limit: MAX_LIMIT,
      department: officerDeptId,
    },
    !!officerDeptId,
  );

  const servicesOptions = useMemo(() => {
    const raw =
      (Array.isArray(servicesData?.data?.data)
        ? servicesData?.data?.data
        : servicesData?.data?.data?.docs) || [];
    return raw.map((s) => ({
      label: s.title || s.name || "",
      value: s._id,
    }));
  }, [servicesData]);

  // 2) Fetch Districts
  const { data: districtsData, isLoading: districtsLoading } =
    useGetDistrictsList({ page: 1, limit: MAX_LIMIT });

  const mapAddressOptions = (arr = []) => {
    const seen = new Set();
    const options = [];
    arr.forEach((item) => {
      if (!item) return;
      const id = item._id || item.id || item.value || item;
      if (seen.has(id)) return;
      seen.add(id);
      options.push({
        label:
          lang === "hi" && item.name_local
            ? item.name_local
            : item.name_en || item.name || item.title || String(id),
        value: id,
        raw: item,
      });
    });
    return options;
  };

  const districtOptions = useMemo(() => {
    const raw =
      (Array.isArray(districtsData?.data?.data?.docs)
        ? districtsData?.data?.data?.docs
        : Array.isArray(districtsData?.data?.data)
          ? districtsData?.data?.data
          : districtsData?.data?.docs) || [];
    return mapAddressOptions(raw);
  }, [districtsData, lang]);

  const hasSelectedDistricts =
    Array.isArray(selectedDistricts) && selectedDistricts.length > 0;
  const hasRural =
    Array.isArray(selectedAreaType) && selectedAreaType.includes("rural");
  const hasUrban =
    Array.isArray(selectedAreaType) && selectedAreaType.includes("urban");

  const hasSelectedBlocks =
    Array.isArray(selectedBlocks) && selectedBlocks.length > 0;
  const hasSelectedUrbanPanchayats =
    Array.isArray(selectedUrbanPanchayats) &&
    selectedUrbanPanchayats.length > 0;

  // 3) Fetch Blocks (when districts selected)
  const { data: blocksData, isLoading: blocksLoading } =
    useGetBlocksByDistricts(selectedDistricts, hasSelectedDistricts);

  const blockOptions = useMemo(() => {
    return mapAddressOptions(blocksData || []);
  }, [blocksData, lang]);

  // 4) Fetch Panchayats (when rural & blocks selected)
  const { data: panchayatsData, isLoading: panchayatsLoading } =
    useGetPanchayatsByBlocks(selectedBlocks, hasRural && hasSelectedBlocks);

  const panchayatOptions = useMemo(() => {
    return mapAddressOptions(panchayatsData || []);
  }, [panchayatsData, lang]);

  // 5) Fetch Urban Panchayats / ULBs (when urban & districts selected)
  const { data: ulbsData, isLoading: ulbsLoading } = useGetUlbsByDistricts(
    selectedDistricts,
    hasUrban && hasSelectedDistricts,
  );

  const urbanPanchayatOptions = useMemo(() => {
    return mapAddressOptions(ulbsData || []);
  }, [ulbsData, lang]);

  // 6) Fetch Wards (when urban & urbanPanchayats selected)
  const { data: wardsData, isLoading: wardsLoading } = useGetWardsByUlbs(
    selectedUrbanPanchayats,
    hasUrban && hasSelectedUrbanPanchayats,
  );

  const wardOptions = useMemo(() => {
    return mapAddressOptions(wardsData || []);
  }, [wardsData, lang]);

  // Area Type Options
  const areaTypeOptions = useMemo(
    () => [
      { label: t("Rural", "ग्रामीण"), value: "rural" },
      { label: t("Urban", "शहरी"), value: "urban" },
    ],
    [t],
  );

  // Field clearing & cascading Pruning on changes / show / hide
  const prevDistrictsRef = useRef(selectedDistricts);
  const prevAreaTypeRef = useRef(selectedAreaType);
  const prevBlocksRef = useRef(selectedBlocks);
  const prevUrbanPanchayatsRef = useRef(selectedUrbanPanchayats);

  // When areaType changes (e.g., removing rural or urban), reset respective fields to []
  useEffect(() => {
    if (!hasRural) {
      if (Array.isArray(selectedPanchayats) && selectedPanchayats.length > 0) {
        setValue("panchayats", []);
      }
    }
    if (!hasUrban) {
      if (
        Array.isArray(selectedUrbanPanchayats) &&
        selectedUrbanPanchayats.length > 0
      ) {
        setValue("urbanPanchayats", []);
      }
      if (Array.isArray(selectedWards) && selectedWards.length > 0) {
        setValue("wards", []);
      }
    }
    prevAreaTypeRef.current = selectedAreaType;
  }, [hasRural, hasUrban, selectedPanchayats, selectedUrbanPanchayats, selectedWards, setValue]);

  // When districts change, prune blocks and urbanPanchayats
  useEffect(() => {
    if (!hasSelectedDistricts) {
      if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
        setValue("blocks", []);
      }
      if (Array.isArray(selectedPanchayats) && selectedPanchayats.length > 0) {
        setValue("panchayats", []);
      }
      if (
        Array.isArray(selectedUrbanPanchayats) &&
        selectedUrbanPanchayats.length > 0
      ) {
        setValue("urbanPanchayats", []);
      }
      if (Array.isArray(selectedWards) && selectedWards.length > 0) {
        setValue("wards", []);
      }
      return;
    }

    // Prune blocks if some became invalid
    if (
      !blocksLoading &&
      blockOptions.length > 0 &&
      Array.isArray(selectedBlocks) &&
      selectedBlocks.length > 0
    ) {
      const validBlockIds = new Set(blockOptions.map((b) => b.value));
      const pruned = selectedBlocks.filter((id) => validBlockIds.has(id));
      if (pruned.length !== selectedBlocks.length) {
        setValue("blocks", pruned);
      }
    }

    // Prune urbanPanchayats if some became invalid
    if (
      !ulbsLoading &&
      urbanPanchayatOptions.length > 0 &&
      Array.isArray(selectedUrbanPanchayats) &&
      selectedUrbanPanchayats.length > 0
    ) {
      const validUlbIds = new Set(urbanPanchayatOptions.map((u) => u.value));
      const pruned = selectedUrbanPanchayats.filter((id) => validUlbIds.has(id));
      if (pruned.length !== selectedUrbanPanchayats.length) {
        setValue("urbanPanchayats", pruned);
      }
    }
  }, [
    hasSelectedDistricts,
    blockOptions,
    blocksLoading,
    selectedBlocks,
    urbanPanchayatOptions,
    ulbsLoading,
    selectedUrbanPanchayats,
    setValue,
  ]);

  // When blocks change, prune panchayats
  useEffect(() => {
    if (!hasSelectedBlocks) {
      if (Array.isArray(selectedPanchayats) && selectedPanchayats.length > 0) {
        setValue("panchayats", []);
      }
      return;
    }

    if (
      !panchayatsLoading &&
      panchayatOptions.length > 0 &&
      Array.isArray(selectedPanchayats) &&
      selectedPanchayats.length > 0
    ) {
      const validPanchayatIds = new Set(panchayatOptions.map((p) => p.value));
      const pruned = selectedPanchayats.filter((id) => validPanchayatIds.has(id));
      if (pruned.length !== selectedPanchayats.length) {
        setValue("panchayats", pruned);
      }
    }
  }, [hasSelectedBlocks, panchayatOptions, panchayatsLoading, selectedPanchayats, setValue]);

  // When urbanPanchayats change, prune wards
  useEffect(() => {
    if (!hasSelectedUrbanPanchayats) {
      if (Array.isArray(selectedWards) && selectedWards.length > 0) {
        setValue("wards", []);
      }
      return;
    }

    if (
      !wardsLoading &&
      wardOptions.length > 0 &&
      Array.isArray(selectedWards) &&
      selectedWards.length > 0
    ) {
      const validWardIds = new Set(wardOptions.map((w) => w.value));
      const pruned = selectedWards.filter((id) => validWardIds.has(id));
      if (pruned.length !== selectedWards.length) {
        setValue("wards", pruned);
      }
    }
  }, [hasSelectedUrbanPanchayats, wardOptions, wardsLoading, selectedWards, setValue]);

  return (
    <LoaderErrWrapper isLoading={districtsLoading}>
      <div className={gridClassName}>
        <div>
          <RhfSelect
            name="officer"
            label={t("Select Officer", "अधिकारी चुनें")}
            required
            options={userOptions}
            placeholder={t("Select an officer", "अधिकारी चुनें")}
            disabled={isEdit}
          />
        </div>

        <div>
          <RhfSelect
            name="services"
            label={t("Services", "सेवाएं")}
            required
            isMultiple={true}
            options={servicesOptions}
            placeholder={
              !selectedOfficer
                ? t("Select officer first", "पहले अधिकारी चुनें")
                : t("Select services", "सेवाएं चुनें")
            }
            isLoading={serviceLoading || serviceFetching}
            disabled={!selectedOfficer}
          />
        </div>

        <div>
          <RhfSelect
            name="districts"
            label={t("District", "ज़िला")}
            required
            isMultiple={true}
            options={districtOptions}
            placeholder={t("Select districts", "ज़िला चुनें")}
            isLoading={districtsLoading}
          />
        </div>

        <div>
          <RhfSelect
            name="blocks"
            label={t("Block", "प्रखंड")}
            isMultiple={true}
            options={blockOptions}
            placeholder={
              !hasSelectedDistricts
                ? t("Select district first", "पहले ज़िला चुनें")
                : t("Select blocks", "प्रखंड चुनें")
            }
            isLoading={blocksLoading}
            disabled={!hasSelectedDistricts}
          />
        </div>

        <div>
          <RhfSelect
            name="areaType"
            label={t("Area Type", "क्षेत्र का प्रकार")}
            required
            isMultiple={true}
            options={areaTypeOptions}
            placeholder={t("Select area type", "क्षेत्र का प्रकार चुनें")}
          />
        </div>

        {/* Rural Fields */}
        {hasRural && (
          <div>
            <RhfSelect
              name="panchayats"
              label={t("Panchayats", "पंचायत")}
              isMultiple={true}
              options={panchayatOptions}
              placeholder={
                !hasSelectedBlocks
                  ? t("Select block first", "पहले प्रखंड चुनें")
                  : t("Select panchayats", "पंचायत चुनें")
              }
              isLoading={panchayatsLoading}
              disabled={!hasSelectedBlocks}
            />
          </div>
        )}

        {/* Urban Fields */}
        {hasUrban && (
          <>
            <div>
              <RhfSelect
                name="urbanPanchayats"
                label={t(
                  "Municipal Corporation",
                  "नगर निगम",
                )}
                isMultiple={true}
                options={urbanPanchayatOptions}
                placeholder={
                  !hasSelectedDistricts
                    ? t("Select district first", "पहले ज़िला चुनें")
                    : t("Select municipal bodies", "नगर निकाय चुनें")
                }
                isLoading={ulbsLoading}
                disabled={!hasSelectedDistricts}
              />
            </div>

            <div>
              <RhfSelect
                name="wards"
                label={t("Wards", "वार्ड")}
                isMultiple={true}
                options={wardOptions}
                placeholder={
                  !hasSelectedUrbanPanchayats
                    ? t("Select municipal body first", "पहले नगर निकाय चुनें")
                    : t("Select wards", "वार्ड चुनें")
                }
                isLoading={wardsLoading}
                disabled={!hasSelectedUrbanPanchayats}
              />
            </div>
          </>
        )}
      </div>
    </LoaderErrWrapper>
  );
}
