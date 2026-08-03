import React from "react";
import { Pencil, Trash2, GripVertical, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReactSortable } from "react-sortablejs";
import { useLanguage } from "@/context/LanguageContext";

export default function WorkflowCards({
  docs = [],
  setDocs,
  onEdit,
  onDelete,
  handleOrderChange,
}) {
  const { t } = useLanguage();

  if (!docs || docs.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No workflow levels found.", "कोई कार्यप्रवाह स्तर नहीं मिला।")}
      </div>
    );
  }

  return (
    <ReactSortable
      list={docs}
      setList={setDocs}
      animation={150}
      handle=".drag-workflow-card"
      className="grid grid-cols-1 gap-3 p-3 xs:p-4"
      onEnd={(evt) => {
        if (handleOrderChange) {
          handleOrderChange(evt.oldIndex, evt.newIndex);
        }
      }}
    >
      {docs.map((level, i) => (
        <Card
          key={level._id || i}
          item={level}
          onEdit={onEdit}
          onDelete={onDelete}
          t={t}
        />
      ))}
    </ReactSortable>
  );
}

function Card({ item, onEdit, onDelete, t }) {
  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Header with Drag Handle */}
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="drag-workflow-card cursor-grab flex items-center justify-center p-1 rounded hover:bg-muted text-muted-foreground/60 hover:text-muted-foreground transition-colors shrink-0">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">
              {item.role?.designationEnglish || "N/A"}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {item.department?.title || item.department || "N/A"}
            </div>
          </div>
        </div>

        <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary shrink-0">
          {t("Level", "स्तर")}: {item.role?.level || "N/A"}
        </Badge>
      </div>

      {/* Body: Role & Description */}
      <div className="p-3 xs:p-3.5 sm:p-4 space-y-2">
        <div className="grid grid-cols-1 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium">
              {t("Department", "विभाग")}
            </span>
            <span className="font-medium text-foreground truncate block">
              {item.department?.title || item.department || "N/A"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium">
              {t("Description", "विवरण")}
            </span>
            <span className="font-normal text-muted-foreground text-xs block">
              {item.description || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(item)}
          className="h-8 text-xs px-2.5"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" />
          {t("Edit", "संपादित करें")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {t("Delete", "हटाएं")}
        </Button>
      </div>
    </div>
  );
}
