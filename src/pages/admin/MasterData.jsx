import React, { useState } from "react";
import { Building2, Tag, MapPin, Globe, FileHeart } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import DesignationsTab from "./master-data/DesignationsTab";
import ServicesTab from "./master-data/ServicesTab";
import ComplaintSourcesTab from "./master-data/ComplaintSourcesTab";
import DemographyTab from "./master-data/DemographyTab";
import GrievenceNatureTab from "./master-data/GrievenceNatureTab";
import { useSearchParams } from "react-router-dom";

const tabs = [
  { id: "designation", label: "Designations", icon: Tag },
  { id: "service", label: "Services & Sub-services", icon: Building2 },
  { id: "source", label: "Complaint Sources", icon: Globe },
  { id: "demography", label: "Demography & ULBs", icon: MapPin },
  { id: "grievances-nature", label: "Grievance Nature", icon: FileHeart },
];

export default function MasterData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(
    (tabs.map((t) => t.id).includes(searchParams.get("tab"))
      ? searchParams.get("tab")
      : undefined) ?? "designation",
  );

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle
          title="Master Data Management"
          subtitle="Manage designations, services, sub-services, complaint sources & demography"
        />

        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setSearchParams({ tab: t.id }, { replace: true });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  tab === t.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Designations */}
        {tab === "designation" && <DesignationsTab />}

        {/* Services */}
        {tab === "service" && <ServicesTab />}

        {/* Sources */}
        {tab === "source" && <ComplaintSourcesTab />}

        {/* Demography */}
        {tab === "demography" && <DemographyTab />}

        {/* Grievance Nature */}
        {tab === "grievances-nature" && <GrievenceNatureTab />}
      </div>
    </PortalLayout>
  );
}
