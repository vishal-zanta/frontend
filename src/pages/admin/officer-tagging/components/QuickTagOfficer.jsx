import React, { useState } from "react";
import { UserCog, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import MySelect from "@/components/inputs/MySelect";
import { useGetServices, useGetSubservices, useGetDemographics } from "../../master-data/hooks";
import subDivisionsData from "@/utils/sub-divisions.json";
import { MAX_LIMIT } from "@/utils/constants";

export default function QuickTagOfficer({ officers = [], handleSaveTagging }) {
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedSubservices, setSelectedSubservices] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubdivisions, setSelectedSubdivisions] = useState([]);

  // Fetch Services
  const { data: servicesData } = useGetServices([], { page: 1, limit: MAX_LIMIT });
  const servicesOptions = (servicesData?.data?.data?.docs || []).map((s) => ({
    label: s.title || s.name || "",
    value: s._id,
  }));

  // Fetch Subservices based on selectedService
  const { data: subservicesData } = useGetSubservices(
    [selectedService],
    {
      serviceId: Array.isArray(selectedService)
        ? selectedService.join(",")
        : selectedService || "",
      page: 1,
      limit: MAX_LIMIT,
    },
    !!(selectedService && selectedService.length > 0)
  );
  const subservicesOptions = (subservicesData?.data?.data?.docs || []).map((s) => ({
    label: s.title || s.name || "",
    value: s._id,
  }));

  // Fetch Districts (Demographics)
  const { data: demographyData } = useGetDemographics([], { page: 1, limit: MAX_LIMIT });
  const districtOptions = (demographyData?.data?.data?.docs || []).map((d) => ({
    label: d.name,
    value: d._id,
    name: d.name,
  }));

  // Map Subdivisions options based on selectedDistrict
  const selectedDistrictObj = districtOptions.find((d) => d.value === selectedDistrict);
  const districtLabel = selectedDistrictObj?.name;
  const rawSubdivisions = districtLabel ? subDivisionsData[districtLabel] || [] : [];
  const subdivisionOptions = rawSubdivisions.map((sub) => ({
    label: sub,
    value: sub,
  }));

  const handleSubmit = () => {
    if (!selectedOfficer || selectedSubservices.length === 0 || selectedSubdivisions.length === 0) {
      return;
    }
    handleSaveTagging({
      officer: selectedOfficer,
      service: selectedService,
      services: selectedSubservices,
      district: selectedDistrict,
      wards: selectedSubdivisions,
    });
    // Clear state
    setSelectedOfficer("");
    setSelectedService("");
    setSelectedSubservices([]);
    setSelectedDistrict("");
    setSelectedSubdivisions([]);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <UserCog className="w-5 h-5 text-blue-500" /> Quick Tag Officer
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <MySelect
            label="Select Officer *"
            options={officers}
            value={selectedOfficer}
            onValueChange={setSelectedOfficer}
            placeholder="Select officer..."
          />
        </div>
        <div>
          <MySelect
            label="Service (Multi-select) *"
            isMultiple
            options={servicesOptions}
            value={selectedService}
            onValueChange={(val) => {
              setSelectedService(val);
              setSelectedSubservices([]);
            }}
            placeholder="Select services..."
          />
        </div>
        <div>
          <MySelect
            label="Sub-services (Multi-select) *"
            isMultiple
            options={subservicesOptions}
            value={selectedSubservices}
            onValueChange={setSelectedSubservices}
            placeholder={
              !selectedService || selectedService.length === 0
                ? "Select service first"
                : "Select sub-services..."
            }
            disabled={!selectedService || selectedService.length === 0}
          />
        </div>
        <div>
          <MySelect
            label="District *"
            options={districtOptions}
            value={selectedDistrict}
            onValueChange={(val) => {
              setSelectedDistrict(val);
              setSelectedSubdivisions([]);
            }}
            placeholder="Select district..."
          />
        </div>
        <div>
          <MySelect
            label="Subdivision (Multi-select) *"
            isMultiple
            options={subdivisionOptions}
            value={selectedSubdivisions}
            onValueChange={setSelectedSubdivisions}
            placeholder={
              !selectedDistrict
                ? "Select district first"
                : "Select subdivisions..."
            }
            disabled={!selectedDistrict}
          />
        </div>
      </div>
      <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
        <Save className="w-4 h-4 mr-1" /> Save Tagging
      </Button>
    </div>
  );
}
