import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MyTable from "@/components/MyTable";

const GrievenceItems = ({ rawItems = [], setDialog , sortProps}) => {
  const tableHeaders = [
    { id: "title", label: "Title" },
    { id: "type", label: "Type", isSortable: true },
    { id: "actions", label: "Actions", className: "text-center" },
  ];

  const tableBody = rawItems.map((item) => ({
    title: {
      value: item.title,
      className: "font-medium text-foreground",
    },
    type: {
      value: item.type,
      className: "text-muted-foreground text-xs",
    },
    actions: {
      className: "text-center",
      render: () => (
        <div className="flex gap-1 justify-center">
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
      ),
    },
  }));

  return (
    <MyTable
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      sortProps={sortProps}
    />
  );
};

export default GrievenceItems;
