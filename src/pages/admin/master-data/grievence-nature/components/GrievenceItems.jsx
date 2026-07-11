import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const GrievenceItems = ({ rawItems = [], setDialog }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rawItems.map((item) => (
            <tr key={item._id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium text-foreground">
                {item.title}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">
                {item.type || "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDialog({ type: "edit", item })}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => setDialog({ type: "delete", item })}
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
};

export default GrievenceItems;
