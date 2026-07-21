import React, { useEffect, useState } from "react";
import { Building2, Tag, MapPin, Globe, FileHeart, Briefcase, Award } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import DesignationsTab from "./designation";
import ServicesTab from "./services";
import ComplaintSourcesTab from "./complaint-sources";
import DemographyTab from "./demography";
import GrievenceNatureTab from "./grievence-nature";
import DepartmentTab from "./departments";
import SkillSetTab from "./skill-set";

import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/utils/constants";

const tabs = [
  {
    id: "designation",
    label: "Designations",
    icon: Tag,
    permissions: PERMISSIONS.ROLE_MANAGEMENT,
    group: "internal",
  },
  {
    id: "departments",
    label: "Departments",
    icon: Briefcase,
    permissions: PERMISSIONS.DEPARTMENT_MANAGEMENT,
    group: "internal",
  },
  {
    id: "skill-set",
    label: "Skill Set",
    icon: Award,
    permissions: PERMISSIONS.USER_MANAGEMENT,
    group: "internal",
  },
  {
    id: "service",
    label: "Services & Sub-services",
    icon: Building2,
    permissions: PERMISSIONS.SERVICE_MANAGEMENT,
    group: "external",
  },
  {
    id: "source",
    label: "Complaint Sources",
    icon: Globe,
    permissions: PERMISSIONS.SOURCE_MANAGEMENT,
    group: "external",
  },
  {
    id: "demography",
    label: "Demography & ULBs",
    icon: MapPin,
    permissions: PERMISSIONS.DEMOGRAPHY_MANAGEMENT,
    group: "external",
  },
  {
    id: "grievances-nature",
    label: "Grievance Nature",
    icon: FileHeart,
    permissions: PERMISSIONS.OPTION_MANAGEMENT,
    group: "external",
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

        <div className="space-y-6">
          {/* Internal group */}
          {filteredTabs.some((t) => t.group === "internal") && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Internal Configuration
              </h3>
              <div className="flex flex-wrap gap-2">
                {filteredTabs
                  .filter((t) => t.group === "internal")
                  .map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTab(t.id);
                          setSearchParams({ tab: t.id }, { replace: true });
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
            </div>
          )}

          {/* External group */}
          {filteredTabs.some((t) => t.group === "external") && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                External Configuration
              </h3>
              <div className="flex flex-wrap gap-2">
                {filteredTabs
                  .filter((t) => t.group === "external")
                  .map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTab(t.id);
                          setSearchParams({ tab: t.id }, { replace: true });
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
            </div>
          )}
        </div>

        {/* Designations */}
        {tab === "designation" && <DesignationsTab />}
        
        {tab === "departments" && <DepartmentTab />}
        {tab === "skill-set" && <SkillSetTab />}



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
