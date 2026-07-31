import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useLanguage } from "@/context/LanguageContext";

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
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left text-xs text-muted-foreground">
            <th className="w-10 px-4 py-3"></th>
            <th className="px-4 py-3 font-medium">{t("Level", "स्तर")}</th>
            <th className="px-4 py-3 font-medium">{t("Department", "विभाग")}</th>
            <th className="px-4 py-3 font-medium">{t("Role", "भूमिका")}</th>
            <th className="px-4 py-3 font-medium">{t("Description", "विवरण")}</th>
            <th className="px-4 py-3 font-medium text-center">{t("Actions", "कार्रवाई")}</th>
          </tr>
        </thead>

        <ReactSortable
          list={docs}
          setList={setDocs}
          animation={150}
          handle=".drag-workflow"
          tag={CustomComponent}
          onEnd={(evt) => {
            console.log("Sortable onEnd event:", evt);
            handleOrderChange(evt.oldIndex, evt.newIndex);
          }}
        >
          {docs.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                {t("No workflow levels found.", "कोई कार्यप्रवाह स्तर नहीं मिला।")}
              </td>
            </tr>
          ) : (
            docs.map((level, i) => (
              <tr key={level._id || i} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="drag-workflow cursor-grab flex items-center justify-center w-5 h-5 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">
                  {level.role?.level || "N/A"}
                </td>
                <td className="px-4 py-3 font-medium text-muted-foreground">
                  {level.department?.title || level.department || "N/A"}
                </td>
                <td className="px-4 py-3 font-medium">
                  {level.role?.designationEnglish || "N/A"}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {level.description || "N/A"}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(level)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" /> {t("Edit", "संपादित करें")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => onDelete(level)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </ReactSortable>
      </table>
    </div>
  );
}
