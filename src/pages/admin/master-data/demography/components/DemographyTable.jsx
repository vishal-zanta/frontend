import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import EditButton from "@/components/EditButton";
import React from "react";

const DemographyTable = ({ districts = [], setDialog }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="text-left text-xs text-muted-foreground">
          <th className="px-4 py-2.5 font-medium">District</th>
          <th className="px-4 py-2.5 font-medium">Hindi</th>
          <th className="px-4 py-2.5 font-medium">Division</th>
          <th className="px-4 py-2.5 font-medium">Zone</th>
          <th className="px-4 py-2.5 font-medium text-right">Population</th>
          <th className="px-4 py-2.5 font-medium text-center">Urban</th>
          <th className="px-4 py-2.5 text-center font-medium">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {districts.map((d) => (
          <tr key={d._id} className="hover:bg-muted/30">
            <td className="px-4 py-2.5 font-medium">{d.name}</td>
            <td className="px-4 py-2.5 text-muted-foreground">
              {d.nameHindi || "-"}
            </td>
            <td className="px-4 py-2.5 text-muted-foreground">{d.division}</td>
            <td className="px-4 py-2.5 text-muted-foreground">{d.zone}</td>
            <td className="px-4 py-2.5 text-right font-semibold">
              {d.population.toLocaleString("en-IN")}
            </td>
            <td className="px-4 py-2.5 text-center">{d.urban ? "✅" : "-"}</td>
            <td className="px-4 py-2.5 text-center">
              <div className="flex gap-1 justify-center">
                <EditButton onClick={() => setDialog({ type: "edit", item: d })} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-destructive/10"
                  onClick={() => setDialog({ type: "delete", item: d })}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DemographyTable;
