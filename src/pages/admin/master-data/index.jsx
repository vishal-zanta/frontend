import React, { useEffect, useState } from "react";
import { Building2, Tag, MapPin, Globe, FileHeart } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import DesignationsTab from "./designation";
import ServicesTab from "./services";
import ComplaintSourcesTab from "./complaint-sources";
import DemographyTab from "./demography";
import GrievenceNatureTab from "./grievence-nature";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  {
    id: "designation",
    label: "Designations",
    icon: Tag,
    permissions: ["ROLE_MANAGEMENT"],
  },
  {
    id: "service",
    label: "Services & Sub-services",
    icon: Building2,
    permissions: ["SERVICE_MANAGEMENT"],
  },
  {
    id: "source",
    label: "Complaint Sources",
    icon: Globe,
    permissions: ["SOURCE_MANAGEMENT"],
  },
  {
    id: "demography",
    label: "Demography & ULBs",
    icon: MapPin,
    permissions: ["DEMOGRAPHY_MANAGEMENT"],
  },
  {
    id: "grievances-nature",
    label: "Grievance Nature",
    icon: FileHeart,
    permissions: ["OPTION_MANAGEMENT"],
  },
];

export default function MasterData() {
  const { hasPermission } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const filteredTabs = tabs.filter((t) => hasPermission(t.permissions));

  const [tab, setTab] = useState(
    (filteredTabs.map((t) => t.id).includes(searchParams.get("tab"))
      ? searchParams.get("tab")
      : undefined) ?? filteredTabs?.[0]?.id,
  );

  useEffect(() => {
    if (!filteredTabs.some((s) => s.id == tab)) {
      setTab(filteredTabs?.[0]?.id || "");
    }
  }, [filteredTabs]);

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle
          title="Master Data Management"
          subtitle="Manage designations, services, sub-services, complaint sources & demography"
        />

        <div className="flex flex-wrap gap-2">
          {filteredTabs.map((t) => {
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
