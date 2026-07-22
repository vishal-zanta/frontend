import { SectionTitle } from "@/components/ChartCard";
import PortalLayout from "@/components/PortalLayout";
import React from "react";
import FileSizeSections from "@/components/FileSizeSections";

const index = () => {
  return (
    <PortalLayout>
      <div className="p-6 space-y-6">
        <SectionTitle
          title={"Admin Settings"}
          subtitle={"Manage file size upload"}
        />

        <FileSizeSections/>
      </div>
    </PortalLayout>
  );
};

export default index;
