import React, { useEffect, useMemo } from "react";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import { useGetServices } from "../../master-data/hooks";
import {
  useGetDivisions,
  useGetSubdivisionsByDivision,
} from "../hooks";
import { MAX_LIMIT } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

export default function Form({
  isEdit,
  isLoading,
  userOptions = [],
  onCancel,
}) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const { t } = useLanguage();
  const selectedDivisions = useWatch({ name: "divisions" });
  const selectedSubdivisions = useWatch({ name: "subdivisions" });
  const selectedOfficer = useWatch({ name: "officer" });
  const officerDept = (
    userOptions.find((u) => u.value === selectedOfficer)?.apiData || {}
  )?.role?.department;

  // Fetch Services for officer's department
  const {
    data: servicesData,
    isLoading: serviceLoading,
    isFetching: serviceFetching,
  } = useGetServices(
    [officerDept?._id],
    {
      page: 1,
      limit: MAX_LIMIT,
      department: officerDept?._id,
    },
    !!officerDept?._id,
  );
  const servicesOptions = useMemo(() => {
    return (servicesData?.data?.data?.docs || []).map((s) => ({
      label: s.title || s.name || "",
      value: s._id,
    }));
  }, [servicesData]);

  // Fetch Divisions
  const { data: divisionsData, isLoading: divisionsLoading } =
    useGetDivisions();
  const divisionOptions = useMemo(() => {
    const raw =
      (Array.isArray(divisionsData?.data?.data)
        ? divisionsData?.data?.data
        : divisionsData?.data?.data?.docs) || [];
    return raw.map((d) => ({
      label: t(d.name_en || d.name, d.name_local || d.nameHindi),
      value: d._id,
    }));
  }, [divisionsData, t]);

  // Fetch Subdivisions by Divisions
  const hasSelectedDivisions =
    Array.isArray(selectedDivisions) && selectedDivisions.length > 0;
  const {
    data: subdivisionsData,
    isLoading: subdivisionsLoading,
    isFetching: subdivisionsFetching,
  } = useGetSubdivisionsByDivision(
    selectedDivisions,
    hasSelectedDivisions,
  );

  const subdivisionOptions = useMemo(() => {
    const raw =
      (Array.isArray(subdivisionsData?.data?.data)
        ? subdivisionsData?.data?.data
        : subdivisionsData?.data?.data?.docs) || [];
    return raw.map((sub) => ({
      label: t(sub.name_en || sub.name, sub.name_local || sub.nameHindi),
      value: sub._id || sub.name_en || sub.name,
    }));
  }, [subdivisionsData, t]);

  const divisionsKey = Array.isArray(selectedDivisions)
    ? selectedDivisions.join(",")
    : "";
  const subdivisionsKey = Array.isArray(selectedSubdivisions)
    ? selectedSubdivisions.join(",")
    : "";

  // When divisions change or clear, prune subdivisions
  useEffect(() => {
    if (!hasSelectedDivisions) {
      if (Array.isArray(selectedSubdivisions) && selectedSubdivisions.length > 0) {
        setValue("subdivisions", []);
      }
      return;
    }

    if (
      !subdivisionsLoading &&
      subdivisionOptions.length > 0 &&
      Array.isArray(selectedSubdivisions) &&
      selectedSubdivisions.length > 0
    ) {
      const validOptionValues = new Set(
        subdivisionOptions.map((opt) => opt.value),
      );
      const filtered = selectedSubdivisions.filter((val) =>
        validOptionValues.has(val),
      );
      if (filtered.length !== selectedSubdivisions.length) {
        setValue("subdivisions", filtered);
      }
    }
  }, [
    divisionsKey,
    subdivisionsKey,
    subdivisionOptions,
    subdivisionsLoading,
    hasSelectedDivisions,
    setValue,
  ]);

  return (
    <LoaderErrWrapper isLoading={divisionsLoading}>
      <div className="space-y-4">
        <RhfSelect
          name="officer"
          label={t("Select Officer", "अधिकारी चुनें")}
          required
          options={userOptions}
          placeholder={t("Select an officer", "अधिकारी चुनें")}
          disabled={isEdit}
        />
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
        <RhfSelect
          name="divisions"
          label={t("Divisions", "प्रमंडल")}
          required
          isMultiple={true}
          options={divisionOptions}
          placeholder={t("Select divisions", "प्रमंडल चुनें")}
          isLoading={divisionsLoading}
        />
        <RhfSelect
          name="subdivisions"
          label={t("Subdivisions", "अनुमंडल")}
          required
          isMultiple={true}
          options={subdivisionOptions}
          placeholder={
            !hasSelectedDivisions
              ? t("Select division first", "पहले प्रमंडल चुनें")
              : t("Select subdivisions", "अनुमंडल चुनें")
          }
          isLoading={subdivisionsLoading || subdivisionsFetching}
          disabled={!hasSelectedDivisions}
        />
        <div className="py-4 sticky bottom-0 bg-card flex justify-between">
          <div className="flex items-center">
            {Object.keys(errors).length > 0 && (
              <span className="text-destructive text-xs font-semibold animate-pulse">
                {t(
                  "* Please fix form errors first",
                  "* कृपया पहले फॉर्म की त्रुटियों को सुधारें",
                )}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2 ">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              {t("Cancel", "रद्द करें")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading
                ? t("Saving...", "सहेजा जा रहा है...")
                : t("Save", "सहेजें")}
            </Button>
          </div>
        </div>
      </div>
    </LoaderErrWrapper>
  );
}
