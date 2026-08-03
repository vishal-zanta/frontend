import { SectionTitle } from "@/components/ChartCard";
import PortalLayout from "@/components/PortalLayout";
import React from "react";
import FileSizeSections from "@/components/FileSizeSections";
import { useLanguage } from "@/context/LanguageContext";

const AdminSettings = () => {
  const { t } = useLanguage();
  return (
    <PortalLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={t("Admin Settings", "प्रशासनिक सेटिंग्स")}
          subtitle={t(
            "Manage admin settings",
            "प्रशासनिक सेटिंग्स प्रबंधित करें",
          )}
        />

        <FileSizeSections />
      </div>
    </PortalLayout>
  );
};

export default AdminSettings;
