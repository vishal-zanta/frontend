import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiPermissionOptions, USER_ROLES_EXECULDED } from "@/utils/constants";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import DesignationCards from "./DesignationCards";

const DesignationTable = ({ designations = [], setDialog }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const nonEditable = USER_ROLES_EXECULDED;

  if (isMobile) {
    return <DesignationCards designations={designations} setDialog={setDialog} />;
  }

  const tableHeaders = [
    { id: "english", label: t("Designation (English)", "पदनाम (अंग्रेज़ी)") },
    { id: "hindi", label: t("Designation (Hindi)", "पदनाम (हिंदी)") },
    { id: "department", label: t("Department", "विभाग") },
    { id: "level", label: t("Level", "स्तर") },
    { id: "permissions", label: t("Permissions", "अनुमतियाँ"), className: "min-w-[280px]" },
    { id: "actions", label: t("Actions", "कार्रवाई"), className: "text-center" },
  ];

  const tableBody = (designations || []).map((d, i) => ({
    english: { className: "font-medium", value: d.designationEnglish },
    hindi: { className: "text-muted-foreground", value: d.designationHindi || "N/A" },
    department: {
      className: "text-muted-foreground",
      value: d.department?.title || d.department || "N/A",
    },
    level: {
      value: (
        <Badge variant="outline" className="text-xs">
          {d.level}
        </Badge>
      ),
    },
    permissions: {
      className: "min-w-[280px]",
      value: (
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
          {(d.permissions || []).length === 0 && "N/A"}
        </div>
      ),
    },
    actions: {
      className: "text-center",
      value: !nonEditable.includes(d.designationEnglish) ? (
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
      ) : null,
    },
  }));

  return <MyTable tableHeaders={tableHeaders} tableBody={tableBody} />;
};

export default DesignationTable;
