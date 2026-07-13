import React from "react";
import ComplaintVolumeChart from "./charts/ComplaintVolumeChart";
import CategoryDistributionChart from "./charts/CategoryDistributionChart";
import { DAILY_VOLUME, CATEGORY_DISTRIBUTION } from "@/lib/biharData";

export default function VolumeAndCategorySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ComplaintVolumeChart data={DAILY_VOLUME} />
      <CategoryDistributionChart data={CATEGORY_DISTRIBUTION} />
    </div>
  );
}
