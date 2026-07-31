import React, { useEffect, useState } from "react";
import { UserCog, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import MySelect from "@/components/inputs/MySelect";
import {
  useGetServices,
  useGetSubservices,
  useGetDemographics,
} from "../../master-data/hooks";
import subDivisionsData from "@/utils/sub-divisions.json";
import { MAX_LIMIT } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function QuickTagOfficer({
  officers = [],
  handleSaveTagging,
  isLoading,
  department,
}) {
  const { t } = useLanguage();
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedSubservices, setSelectedSubservices] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
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
  const servicesOptions = (servicesData?.data?.data?.docs || []).map((s) => ({
    label: s.title || s.name || "",
    value: s._id,
  }));

  // Fetch Subservices based on selectedService
  const { data: subservicesData,    isLoading: subServiceLoading,
    isFetching: subServiceFetching, } = useGetSubservices(
    [selectedService],
    {
      serviceId: Array.isArray(selectedService)
        ? selectedService.join(",")
        : selectedService || "",
      page: 1,
      limit: MAX_LIMIT,
    },
    !!(selectedService && selectedService.length > 0),
  );
  const subservicesOptions = (subservicesData?.data?.data?.docs || []).map(
    (s) => ({
      label: s.title || s.name || "",
      value: s._id,
    }),
  );

  // Fetch Districts (Demographics)
  const { data: demographicsData } = useGetDemographics([], {
    page: 1,
    limit: MAX_LIMIT,
  });
  const districtOptions = (demographicsData?.data?.data?.docs || []).map(
    (d) => ({
      label: d.name,
      value: d._id,
    }),
  );

  const subdivisionOptions = (
    subDivisionsData[selectedDistrict] || []
  ).map((sd) => ({
    label: sd,
    value: sd,
  }));

  const clearState = () => {
    setSelectedOfficer("");
    setSelectedService([]);
    setSelectedSubservices([]);
    setSelectedDistrict("");
    setSelectedSubdivisions([]);
  };

  const handleSubmit = () => {
    if (
      !selectedOfficer ||
      !selectedService.length ||
      !selectedSubservices.length ||
      !selectedDistrict ||
      !selectedSubdivisions.length
    ) {
      return;
    }

    handleSaveTagging({
      officer: selectedOfficer,
      department: department,
      services: selectedService,
      subServices: selectedSubservices,
      district: selectedDistrict,
      subDivisions: selectedSubdivisions,
    });
    // Clear state
    clearState();
  };
  useEffect(()=> {
    if(department ){
      clearState();
    }
  },[department])

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <UserCog className="w-5 h-5 text-blue-500" /> {t("Quick Tag Officer", "त्वरित अधिकारी मैपिंग")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <MySelect
            label={t("Select Officer ", "अधिकारी चुनें ")}
            options={officers}
            value={selectedOfficer}
            onValueChange={setSelectedOfficer}
            placeholder={t("Select officer...", "अधिकारी चुनें...")}
            required
          />
        </div>
        <div>
          <MySelect
            label={t("Service (Multi-select) ", "सेवा (बहु-चयन) ")}
            isMultiple
            options={servicesOptions}
            value={selectedService}
            onValueChange={(val) => {
              setSelectedService(val);
              setSelectedSubservices([]);
            }}
            placeholder={!selectedOfficer ? t("Select officer first", "पहले अधिकारी चुनें") : t("Select services...", "सेवाएं चुनें...")}
            required
            disabled={!selectedOfficer}
            isLoading={serviceLoading || serviceFetching}
          />
        </div>
        <div>
          <MySelect
            label={t("Sub-services (Multi-select) ", "उप-सेवाएं (बहु-चयन) ")}
            isMultiple
            options={subservicesOptions}
            value={selectedSubservices}
            onValueChange={setSelectedSubservices}
            placeholder={
              !selectedService || selectedService.length === 0
                ? t("Select service first", "पहले सेवा चुनें")
                : t("Select sub-services...", "उप-सेवाएं चुनें...")
            }
            disabled={!selectedService || selectedService.length === 0}
            isLoading={subServiceFetching || subServiceLoading}
            required
          />
        </div>
        <div>
          <MySelect
            label={t("District ", "जिला ")}
            options={districtOptions}
            value={selectedDistrict}
            onValueChange={(val) => {
              setSelectedDistrict(val);
              setSelectedSubdivisions([]);
            }}
            placeholder={t("Select district...", "जिला चुनें...")}
            required
          />
        </div>
        <div>
          <MySelect
            label={t("Subdivision (Multi-select) ", "अनुमंडल (बहु-चयन) ")}
            isMultiple
            options={subdivisionOptions}
            value={selectedSubdivisions}
            onValueChange={setSelectedSubdivisions}
            placeholder={
              !selectedDistrict
                ? t("Select district first", "पहले जिला चुनें")
                : t("Select subdivisions...", "अनुमंडल चुनें...")
            }
            disabled={!selectedDistrict}
            required
          />
        </div>
      </div>
      <Button
        className="mt-4 bg-primary hover:bg-primary/90"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        <Save className="w-4 h-4 mr-1" />{" "}
        {isLoading ? t("Saving...", "सहेजा जा रहा है...") : t("Save Tagging", "मैपिंग सहेजें")}
      </Button>
    </div>
  );
}
