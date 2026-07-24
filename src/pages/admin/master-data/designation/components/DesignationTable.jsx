import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiPermissionOptions, USER_ROLES_EXECULDED } from "@/utils/constants";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";

const DesignationTable = ({ designations = [], setDialog }) => {
  const nonEditable = USER_ROLES_EXECULDED;

  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="text-left text-xs text-muted-foreground">
          <th className="px-4 py-2 font-medium">Designation (English)</th>
          <th className="px-4 py-2 font-medium">पदनाम (Hindi)</th>
          <th className="px-4 py-2 font-medium">Department</th>
          <th className="px-4 py-2 font-medium">Level</th>
          <th className="px-4 py-2 font-medium min-w-[280px]">Permissions</th>
          <th className="px-4 py-2 font-medium text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {designations.map((d, i) => (
          <tr key={d._id || i} className="hover:bg-muted/30">
            <td className="px-4 py-2.5 font-medium">{d.designationEnglish}</td>
            <td className="px-4 py-2.5 text-muted-foreground">
              {d.designationHindi}
            </td>
            <td className="px-4 py-2.5 text-muted-foreground">
              {d.department?.title || d.department || "-"}
            </td>
            <td className="px-4 py-2.5">
              <Badge variant="outline" className="text-xs">
                {d.level}
              </Badge>
            </td>
            <td className="px-2 py-1 min-w-[280px]">
              <div className="flex flex-wrap gap-1 px-2 py-2 max-w-[350px] max-h-16 overflow-y-auto">
                {(d.permissions || [])
                  .map(
                    (p) =>
                      apiPermissionOptions.find((a) => a.value === p)?.label || p,
                  )
                  .map((p, pi) => (
                    <Badge
                      key={pi}
                      variant="outline"
                      className="text-[10px] bg-primary/10 text-primary text-nowrap"
                    >
                      {p}
                    </Badge>
                  ))}
                {(d.permissions || []).length === 0 && "-"}
              </div>
            </td>
            <td className="px-4 py-2.5 text-center">
              {!nonEditable.includes(d.designationEnglish) && (
                <div className="flex gap-1 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDialog({ type: "edit", item: d })}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-destructive/10"
                    onClick={() => setDialog({ type: "delete", item: d })}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DesignationTable;
