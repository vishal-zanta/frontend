import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useLanguage } from "@/context/LanguageContext";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import WorkflowCards from "./WorkflowCards";

const CustomComponent = forwardRef((props, ref) => {
  return (
    <tbody className="divide-y divide-border" ref={ref}>
      {props.children}
    </tbody>
  );
});
CustomComponent.displayName = "CustomComponent";

export default function WorkflowTable({
  docs = [],
  onEdit,
  onDelete,
  setDocs,
  handleOrderChange,
}) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <WorkflowCards
        docs={docs}
        setDocs={setDocs}
        onEdit={onEdit}
        onDelete={onDelete}
        handleOrderChange={handleOrderChange}
      />
    );
  }

  const tableHeaders = [
    { id: "drag", label: "", className: "w-10" },
    { id: "level", label: t("Level", "स्तर") },
    { id: "department", label: t("Department", "विभाग") },
    { id: "role", label: t("Role", "भूमिका") },
    { id: "description", label: t("Description", "विवरण") },
    { id: "actions", label: t("Actions", "कार्रवाई"), className: "text-center" },
  ];

  const tableBody = docs.map((level) => ({
    drag: {
      render: () => (
        <div className="drag-workflow cursor-grab flex items-center justify-center w-5 h-5 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>
      ),
    },
    level: {
      value: level.role?.level || "N/A",
      className: "font-medium",
    },
    department: {
      value: level.department?.title || level.department || "N/A",
      className: "font-medium text-muted-foreground",
    },
    role: {
      value: level.role?.designationEnglish || "N/A",
      className: "font-medium",
    },
    description: {
      value: level.description || "N/A",
      className: "text-muted-foreground text-xs",
    },
    actions: {
      className: "text-center",
      render: () => (
        <div className="flex gap-1 justify-center">
          <Button variant="ghost" size="sm" onClick={() => onEdit(level)}>
            <Pencil className="w-3.5 h-3.5 mr-1" /> {t("Edit", "संपादित करें")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-destructive/10"
            onClick={() => onDelete(level)}
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
      customTbody={ReactSortable}
      customTbodyProps={{
        list: docs,
        setList: setDocs,
        animation: 150,
        handle: ".drag-workflow",
        tag: CustomComponent,
        onEnd: (evt) => {
          if (handleOrderChange) {
            handleOrderChange(evt.oldIndex, evt.newIndex);
          }
        },
      }}
    />
  );
}
