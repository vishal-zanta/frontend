import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import EditButton from "@/components/EditButton";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import DemographyCards from "./DemographyCards";

const DemographyTable = ({ districts = [], setDialog }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DemographyCards districts={districts} setDialog={setDialog} />;
  }

  const tableHeaders = [
    { id: "district", label: t("District", "जिला") },
    { id: "hindi", label: t("Hindi", "हिंदी") },
    { id: "division", label: t("Division", "प्रमंडल") },
    { id: "zone", label: t("Zone", "जोन") },
    { id: "population", label: t("Population", "जनसंख्या"), className: "text-right" },
    { id: "urban", label: t("Urban", "शहरी"), className: "text-center" },
    { id: "actions", label: t("Actions", "कार्रवाई"), className: "text-center" },
  ];

  const tableBody = (districts || []).map((d) => ({
    district: { className: "font-medium", value: d.name },
    hindi: { className: "text-muted-foreground", value: d.nameHindi || "N/A" },
    division: { className: "text-muted-foreground", value: d.division || "N/A" },
    zone: { className: "text-muted-foreground", value: d.zone || "N/A" },
    population: {
      className: "text-right font-semibold",
      value: d.population ? d.population.toLocaleString("en-IN") : "N/A",
    },
    urban: {
      className: "text-center",
      value: d.urban ? "✅" : "N/A",
    },
    actions: {
      className: "text-center",
      value: (
        <div className="flex gap-1 justify-center">
          <EditButton onClick={() => setDialog({ type: "edit", item: d })} />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-destructive/10"
            onClick={() => setDialog({ type: "delete", item: d })}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  }));

  return <MyTable tableHeaders={tableHeaders} tableBody={tableBody} />;
};

export default DemographyTable;
