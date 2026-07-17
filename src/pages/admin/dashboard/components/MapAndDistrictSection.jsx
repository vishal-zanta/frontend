import React from "react";
import { ChartCard } from "@/components/ChartCard";
import ComplaintMap from "@/components/ComplaintMap";
import ExportButton from "@/components/ExportButton";

const districtExportColumns = [
  { key: "_id", label: "District" },
  { key: "total", label: "Total" },
  { key: "resolved", label: "Resolved" },
  { key: "pending", label: "Pending" },
  { key: "inProgress", label: "In Progress" },
  { key: "escalated", label: "Escalated" },
];

export default function MapAndDistrictSection({ districtData }) {
  const dataList = districtData || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ChartCard
        title="Complaint Hotspot Map"
        subtitle="Geo-tagged complaint density by ward"
        className="lg:col-span-1"
      >
        <ComplaintMap
          height={320}
          showHotspots={true}
          center={[25.61, 85.13]}
          zoom={7}
        />
      </ChartCard>
      <ChartCard
        title="District-wise Complaints"
        subtitle="Status breakdown by district"
        className="lg:col-span-2"
        actions={
          <ExportButton
            data={dataList}
            columns={districtExportColumns}
            filename="district_wise_complaints"
          />
        }
      >
        <div className="overflow-x-auto max-h-[320px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-[#F4F7FA] sticky top-0">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">District</th>
                <th className="px-3 py-2 font-medium text-right">Total</th>
                <th className="px-3 py-2 font-medium text-right">Resolved</th>
                <th className="px-3 py-2 font-medium text-right">Pending</th>
                <th className="px-3 py-2 font-medium text-right">In Progress</th>
                <th className="px-3 py-2 font-medium text-right">Escalated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dataList.map((d, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{d.name || "-"}</td>
                  <td className="px-3 py-2 text-right font-semibold">
                    {(d.total || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-right text-emerald-600">
                    {(d.resolved || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-right text-amber-600">
                    {(d.pending || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-right text-blue-600">
                    {(d.inProgress || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-right text-red-600">
                    {(d.escalated || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
