import React, { useEffect, useState } from "react";
import {
  Building2,
  Tag,
  MapPin,
  Globe,
  FileHeart,
  Briefcase,
  Award,
  Key,
} from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import DesignationsTab from "./designation";
import ServicesTab from "./services";
import ComplaintSourcesTab from "./complaint-sources";
import DemographyTab from "./demography";
import GrievenceNatureTab from "./grievence-nature";
import DepartmentTab from "./departments";
import SkillSetTab from "./skill-set";
import ApiKeysTab from "./api-keys";

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
    id: "api-keys",
    label: "API Keys",
    icon: Key,
    permissions: PERMISSIONS.API_KEYS_MANAGEMENT,
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

const tabLabels = {
  designation: ["Designations", "पदनाम"],
  departments: ["Departments", "विभाग"],
  "skill-set": ["Skill Set", "कौशल सेट"],
  "api-keys": ["API Keys", "API कुंजियाँ"],
  service: ["Services & Sub-services", "सेवाएं और उप-सेवाएं"],
  source: ["Complaint Sources", "शिकायत के स्रोत"],
  demography: ["Demography & ULBs", "जनसांख्यिकी और ULBs"],
  "grievances-nature": ["Grievance Nature", "शिकायत की प्रकृति"],
};

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
      const defaultGroup =
        tabs.find((t) => t.id === defaultTab)?.group || "internal";
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={translate("Master Data Management", "मास्टर डेटा प्रबंधन")}
          subtitle={translate(
            "Manage designations, services, sub-services, complaint sources & demography",
            "पदनाम, सेवाएं, उप-सेवाएं, शिकायत के स्रोत और जनसांख्यिकी प्रबंधित करें",
          )}
        />

        <Tabs
          value={parentTab}
          onValueChange={handleParentTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:max-w-[500px] h-auto p-1 gap-1 border border-border/50">
            <TabsTrigger
              value="internal"
              className="px-2 xs:px-3 py-2 sm:py-1.5 text-xs xs:text-xs sm:text-sm font-medium text-center truncate"
            >
              {translate("Internal Configuration", "आंतरिक कॉन्फ़िगरेशन")}
            </TabsTrigger>
            <TabsTrigger
              value="external"
              className="px-2 xs:px-3 py-2 sm:py-1.5 text-xs xs:text-xs sm:text-sm font-medium text-center truncate"
            >
              {translate("External Configuration", "बाहरी कॉन्फ़िगरेशन")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="mt-4">
            <Tabs
              value={tab}
              onValueChange={(val) => {
                setTab(val);
                setSearchParams({ tab: val }, { replace: true });
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 xs:flex xs:flex-wrap h-auto p-1 bg-muted rounded-lg w-full sm:w-fit gap-1 border border-border/40">
                {filteredTabs
                  .filter((t) => t.group === "internal")
                  .map((t) => {
                    const Icon = t.icon;
                    const labelInfo = tabLabels[t.id] || [t.label, t.label];
                    return (
                      <TabsTrigger
                        key={t.id}
                        value={t.id}
                        className="flex items-center justify-center sm:justify-start gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1.5 text-[11px] xs:text-xs lg:text-sm font-medium truncate"
                      >
                        <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                        <span className="truncate">{translate(labelInfo[0], labelInfo[1])}</span>
                      </TabsTrigger>
                    );
                  })}
              </TabsList>
            </Tabs>
          </TabsContent>

          <TabsContent value="external" className="mt-4">
            <Tabs
              value={tab}
              onValueChange={(val) => {
                setTab(val);
                setSearchParams({ tab: val }, { replace: true });
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 xs:flex xs:flex-wrap h-auto p-1 bg-muted rounded-lg w-full sm:w-fit gap-1 border border-border/40">
                {filteredTabs
                  .filter((t) => t.group === "external")
                  .map((t) => {
                    const Icon = t.icon;
                    const labelInfo = tabLabels[t.id] || [t.label, t.label];
                    return (
                      <TabsTrigger
                        key={t.id}
                        value={t.id}
                        className="flex items-center justify-center sm:justify-start gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1.5 text-[11px] xs:text-xs lg:text-sm font-medium truncate"
                      >
                        <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                        <span className="truncate">{translate(labelInfo[0], labelInfo[1])}</span>
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
        {tab === "api-keys" && <ApiKeysTab />}

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
