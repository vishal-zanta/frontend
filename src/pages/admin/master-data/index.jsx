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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t: translate } = useLanguage();

  const [searchParams, setSearchParams] = useSearchParams();
  const filteredTabs = tabs.filter((t) => hasPermission(t.permissions));

  const [tab, setTab] = useState(
    (filteredTabs.map((t) => t.id).includes(searchParams.get("tab"))
      ? searchParams.get("tab")
      : undefined) ?? filteredTabs?.[0]?.id,
  );

  const currentTabGroup = tabs.find((t) => t.id === tab)?.group || "internal";
  const [parentTab, setParentTab] = useState(currentTabGroup);

  useEffect(() => {
    if (!filteredTabs.some((s) => s.id == tab)) {
      const defaultTab = filteredTabs?.[0]?.id || "";
      setTab(defaultTab);
      const defaultGroup = tabs.find((t) => t.id === defaultTab)?.group || "internal";
      setParentTab(defaultGroup);
    }
  }, [filteredTabs]);

  const handleParentTabChange = (group) => {
    setParentTab(group);
    const firstTabInGroup = filteredTabs.find((t) => t.group === group);
    if (firstTabInGroup) {
      setTab(firstTabInGroup.id);
      setSearchParams({ tab: firstTabInGroup.id }, { replace: true });
    }
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle
          title="Master Data Management"
          subtitle="Manage designations, services, sub-services, complaint sources & demography"
        />

        <Tabs value={parentTab} onValueChange={handleParentTabChange} className="w-full">
          <TabsList className="grid w-full max-w-[500px] grid-cols-2">
            <TabsTrigger value="internal">
              {translate("Internal Configuration", "आंतरिक कॉन्फ़िगरेशन")}
            </TabsTrigger>
            <TabsTrigger value="external">
              {translate("External Configuration", "बाहरी कॉन्फ़िगरेशन")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="mt-4">
            <Tabs value={tab} onValueChange={(val) => {
              setTab(val);
              setSearchParams({ tab: val }, { replace: true });
            }} className="w-full">
              <TabsList className="flex flex-wrap h-auto p-1 bg-muted rounded-lg w-fit gap-1">
                {filteredTabs
                  .filter((t) => t.group === "internal")
                  .map((t) => {
                    const Icon = t.icon;
                    return (
                      <TabsTrigger key={t.id} value={t.id} className="flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm">
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </TabsTrigger>
                    );
                  })}
              </TabsList>
            </Tabs>
          </TabsContent>

          <TabsContent value="external" className="mt-4">
            <Tabs value={tab} onValueChange={(val) => {
              setTab(val);
              setSearchParams({ tab: val }, { replace: true });
            }} className="w-full">
              <TabsList className="flex flex-wrap h-auto p-1 bg-muted rounded-lg w-fit gap-1">
                {filteredTabs
                  .filter((t) => t.group === "external")
                  .map((t) => {
                    const Icon = t.icon;
                    return (
                      <TabsTrigger key={t.id} value={t.id} className="flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm">
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </TabsTrigger>
                    );
                  })}
              </TabsList>
            </Tabs>
          </TabsContent>
        </Tabs>

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
