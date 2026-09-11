import React, { useEffect, useMemo, useState } from "react";
import { UserCog, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import MySelect from "@/components/inputs/MySelect";
import { useGetServices } from "../../master-data/hooks";
import {
  useGetDivisions,
  useGetSubdivisionsByDivision,
} from "../hooks";
import { MAX_LIMIT } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

export default function QuickTagOfficer({
  officers = [],
  handleSaveTagging,
  isLoading,
  department,
}) {
  const { t } = useLanguage();
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedSubdivisions, setSelectedSubdivisions] = useState([]);

  // Fetch Services
  const {
    data: servicesData,
    isLoading: serviceLoading,
    isFetching: serviceFetching,
  } = useGetServices(
    [department],
    { page: 1, limit: MAX_LIMIT, department },
    !!department,
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

  // Fetch Divisions
  const { data: divisionsData, isLoading: divisionsLoading } = useGetDivisions();
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

  // Fetch Subdivisions by selected divisions
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
    return raw.map((sd) => ({
      label: t(sd.name_en || sd.name, sd.name_local || sd.nameHindi),
      value: sd._id || sd.name_en || sd.name,
    }));
  }, [subdivisionsData, t]);

  const divisionsKey = Array.isArray(selectedDivisions)
    ? selectedDivisions.join(",")
    : "";
  const subdivisionsKey = Array.isArray(selectedSubdivisions)
    ? selectedSubdivisions.join(",")
    : "";

  // When divisions / subdivisionOptions change, filter out selected subdivisions not present in new options
  useEffect(() => {
    if (!hasSelectedDivisions) {
      if (selectedSubdivisions.length > 0) {
        setSelectedSubdivisions([]);
      }
      return;
    }

    if (
      !subdivisionsLoading &&
      subdivisionOptions.length > 0 &&
      selectedSubdivisions.length > 0
    ) {
      const validOptionValues = new Set(
        subdivisionOptions.map((opt) => opt.value),
      );
      const filtered = selectedSubdivisions.filter((val) =>
        validOptionValues.has(val),
      );
      if (filtered.length !== selectedSubdivisions.length) {
        setSelectedSubdivisions(filtered);
      }
    }
  }, [
    divisionsKey,
    subdivisionsKey,
    subdivisionOptions,
    subdivisionsLoading,
    hasSelectedDivisions,
  ]);

  const clearState = () => {
    setSelectedOfficer("");
    setSelectedServices([]);
    setSelectedDivisions([]);
    setSelectedSubdivisions([]);
  };

  const handleSubmit = () => {
    if (
      !selectedOfficer ||
      !selectedServices.length ||
      !selectedDivisions.length ||
      !selectedSubdivisions.length
    ) {
      return;
    }

    handleSaveTagging({
      officer: selectedOfficer,
      department: department,
      services: selectedServices,
      divisions: selectedDivisions,
      subdivisions: selectedSubdivisions,
    });
    // Clear state
    clearState();
  };

  useEffect(() => {
    if (department) {
      clearState();
    }
  }, [department]);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <UserCog className="w-5 h-5 text-blue-500" />{" "}
        {t("Quick Tag Officer", "त्वरित अधिकारी मैपिंग")}
      </h3>
      <LoaderErrWrapper isLoading={divisionsLoading}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <MySelect
              label={t("Select Officer", "अधिकारी चुनें")}
              options={officers}
              value={selectedOfficer}
              onValueChange={setSelectedOfficer}
              placeholder={t("Select officer...", "अधिकारी चुनें...")}
              required
            />
          </div>
          <div>
            <MySelect
              label={t("Services (Multi-select)", "सेवाएं (बहु-चयन)")}
              isMultiple
              options={servicesOptions}
              value={selectedServices}
              onValueChange={setSelectedServices}
              placeholder={
                !selectedOfficer
                  ? t("Select officer first", "पहले अधिकारी चुनें")
                  : t("Select services...", "सेवाएं चुनें...")
              }
              required
              disabled={!selectedOfficer}
              isLoading={serviceLoading || serviceFetching}
            />
          </div>
          <div>
            <MySelect
              label={t("Divisions (Multi-select)", "प्रमंडल (बहु-चयन)")}
              isMultiple
              options={divisionOptions}
              value={selectedDivisions}
              onValueChange={setSelectedDivisions}
              placeholder={t("Select divisions...", "प्रमंडल चुनें...")}
              isLoading={divisionsLoading}
              required
            />
          </div>
          <div>
            <MySelect
              label={t("Subdivision (Multi-select)", "अनुमंडल (बहु-चयन)")}
              isMultiple
              options={subdivisionOptions}
              value={selectedSubdivisions}
              onValueChange={setSelectedSubdivisions}
              placeholder={
                !selectedDivisions.length
                  ? t("Select division first", "पहले प्रमंडल चुनें")
                  : t("Select subdivisions...", "अनुमंडल चुनें...")
              }
              disabled={!selectedDivisions.length}
              isLoading={subdivisionsLoading || subdivisionsFetching}
              required
            />
          </div>
        </div>
      </LoaderErrWrapper>
      <Button
        className="mt-4 bg-primary hover:bg-primary/90"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        <Save className="w-4 h-4 mr-1" />{" "}
        {isLoading
          ? t("Saving...", "सहेजा जा रहा है...")
          : t("Save Tagging", "मैपिंग सहेजें")}
      </Button>
    </div>
  );
}
