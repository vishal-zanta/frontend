import React from "react";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OfficerTagTable({ tagging = [], setEditItem, setDialog, handleDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-medium">Officer</th>
            <th className="px-4 py-3 font-medium">Designation</th>
            <th className="px-4 py-3 font-medium min-w-60">Sub-services</th>
            <th className="px-4 py-3 font-medium min-w-48">Subdivisions</th>
            <th className="px-4 py-3 font-medium text-center">Active</th>
            <th className="px-4 py-3 font-medium text-center">SLA</th>
            <th className="px-4 py-3 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tagging.map((o, i) => (
            <tr key={i} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{o.officer?.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{o.officer?.role?.designationEnglish}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {(o.services || []).map((s, si) => (
                    <Badge key={si} variant="outline" className="text-[10px] bg-blue-50 text-blue-700">{s.title}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {(o.wards || []).map((w, wi) => (
                    <Badge key={wi} variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">{w}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-center font-semibold">
                <Badge variant="outline" className={`text-xs ${o.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                  {o.active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-1 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditItem(o);
                      setDialog({
                        officer: o.officer?.name || "",
                        designation: o.officer?.role?.designationEnglish || "",
                        services: (o.services || []).map((s) => s.title),
                        wards: o.wards || [],
                        activeComplaints: 0,
                        slaCompliant: true,
                      });
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete && handleDelete(o)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
