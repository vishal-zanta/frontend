import React from "react";
import { CheckCircle2, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SlaTable({ docs = [], roles = [], onEdit, onDelete }) {
  console.log({ roles });
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left text-xs text-muted-foreground">
            <th className="px-3 py-3 font-medium min-w-40 sticky left-0 bg-[#F4F7FA] dark:bg-[#172033]">
              Sub-Service
            </th>
            {roles.map((role) => (
              <th
                key={role._id}
                className="px-3 py-3 font-medium text-center min-w-40"
              >
                {role.designationEnglish}
              </th>
            ))}
            {/* <th className="px-3 py-3 font-medium text-center min-w-40">
              Officer
            </th> */}
            <th className="px-3 py-3 font-medium min-w-40 sticky right-0 bg-[#F4F7FA] dark:bg-[#172033] text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {docs.length === 0 ? (
            <tr>
              <td
                colSpan={roles.length + 3}
                className="text-center py-8 text-muted-foreground"
              >
                No SLA configurations found.
              </td>
            </tr>
          ) : (
            docs.map((s, i) => (
              <tr key={s._id || i} className="hover:bg-muted/30">
                <td className="px-3 py-2.5 font-medium sticky left-0 bg-white dark:bg-[#0f1729] ">
                  {s.subService?.title ||
                    s.subService?.name ||
                    s.subService ||
                    "-"}
                </td>
                {roles.map((role) => {
                  const esc = (s.escalations || []).find(
                    (e) => (e.role?._id || e.role) === role._id,
                  );
                  return (
                    <td key={role._id} className="px-3 py-2.5 text-center">
                      {esc ? (
                        <Badge
                          variant="outline"
                          className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-amber-500/20"
                        >
                          {esc.slaHours}h
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                })}
                {/* <td className="px-3 py-2.5 text-center">
                  {s.officer ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />
                  )}
                </td> */}
                <td className="px-3 py-2.5 sticky right-0 bg-white dark:bg-[#0f1729] text-center">
                  <div className="flex gap-1 justify-center">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(s)}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => onDelete(s)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
