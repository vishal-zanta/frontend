import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import MyTable from "@/components/MyTable";

const DepartmentTable = ({ departments = [], setDialog, pagination }) => {
  const tableHeaders = [
    { id: "title", label: "Department (English)" },
    { id: "titleHindi", label: "विभाग (Hindi)" },
    { id: "actions", label: "Actions", className: "text-center w-28" },
  ];

  const tableBody = departments.map((d) => ({
    title: { value: d.title },
    titleHindi: { value: d.titleHindi || "-" },
    actions: {
      className: "text-center",
      render: () => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setDialog({ type: "edit", item: d })}
            className="p-1 hover:bg-muted rounded text-primary transition-colors"
            title="Edit Department"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDialog({ type: "delete", item: d })}
            className="p-1 hover:bg-muted rounded text-red-600 hover:text-red-700 transition-colors"
            title="Delete Department"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  }));

  return (
    <MyTable
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      pagination={pagination}
    />
  );
};

export default DepartmentTable;
