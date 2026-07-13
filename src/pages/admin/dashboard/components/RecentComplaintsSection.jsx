import React from "react";
import { Link } from "react-router-dom";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { COMPLAINTS } from "@/lib/biharData";

export default function RecentComplaintsSection() {
  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-foreground">Recent Complaints</h3>
        <Link
          to="/admin/audit"
          className="text-sm text-primary hover:underline"
        >
          View Audit Trail
        </Link>
      </div>
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Complaint ID</th>
              <th className="px-4 py-2 font-medium">Citizen</th>
              <th className="px-4 py-2 font-medium">Service</th>
              <th className="px-4 py-2 font-medium">District</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {COMPLAINTS.slice(0, 15).map((c, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-4 py-2.5">
                  <ComplaintId id={c.id} />
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {c.citizenName}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {c.serviceName}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {c.districtName}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : c.status === "Escalated" ? "bg-red-50 text-red-700" : c.status === "Closed" ? "bg-slate-50 text-slate-600" : "bg-blue-50 text-blue-700"}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {c.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
