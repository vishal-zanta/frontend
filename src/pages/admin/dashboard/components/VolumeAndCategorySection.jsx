import React from "react";
import ComplaintVolumeChart from "./charts/ComplaintVolumeChart";
import CategoryDistributionChart from "./charts/CategoryDistributionChart";
export default function VolumeAndCategorySection({complaintVolume, categoryData}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ComplaintVolumeChart mainData={complaintVolume} />
      <CategoryDistributionChart mainData={categoryData} />
    </div>
  );
}
