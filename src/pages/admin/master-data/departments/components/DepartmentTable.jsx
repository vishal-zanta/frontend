import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import MyTable from "@/components/MyTable";
import { useLanguage } from "@/context/LanguageContext";

const DepartmentTable = ({ departments = [], setDialog, pagination }) => {
  const { t } = useLanguage();
  const tableHeaders = [
    { id: "title", label: t("Department (English)", "विभाग (अंग्रेज़ी)") },
    { id: "titleHindi", label: t("Department (Hindi)", "विभाग (हिंदी)") },
    { id: "actions", label: t("Actions", "कार्रवाई"), className: "text-center w-28" },
  ];

  const tableBody = departments.map((d) => ({
    title: { value: d.title },
    titleHindi: { value: d.titleHindi || "N/A" },
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
