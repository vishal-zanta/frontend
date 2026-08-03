import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import SlaCards from "./SlaCards";

export default function SlaTable({ docs = [], roles = [], onEdit, onDelete }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <SlaCards
        docs={docs}
        roles={roles}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  const tableHeaders = [
    {
      id: "subService",
      label: t("Sub-Service", "उप-सेवा"),
      className: "min-w-40 sticky left-0 bg-[#F4F7FA] dark:bg-[#172033]",
    },
    ...roles.map((role) => ({
      id: role._id,
      label: role.designationEnglish,
      className: "text-center min-w-40",
    })),
    {
      id: "actions",
      label: t("Actions", "कार्रवाई"),
      className: "min-w-40 sticky right-0 bg-[#F4F7FA] dark:bg-[#172033] text-center",
    },
  ];

  const tableBody = docs.map((s) => {
    const row = {
      subService: {
        value:
          s.subService?.title ||
          s.subService?.name ||
          s.subService ||
          "N/A",
        className: "font-medium sticky left-0 bg-white dark:bg-[#0f1729]",
      },
    };

    roles.forEach((role) => {
      const esc = (s.escalations || []).find(
        (e) => (e.role?._id || e.role) === role._id
      );

      row[role._id] = {
        className: "text-center",
        render: () =>
          esc ? (
            <Badge
              variant="outline"
              className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-amber-500/20"
            >
              {esc?.slaType === "days" ? esc.slaHours / 24 : esc.slaHours}
              {esc?.slaType === "days" ? "d" : "h"}
            </Badge>
          ) : (
            "N/A"
          ),
      };
    });

    row.actions = {
      className: "sticky right-0 bg-white dark:bg-[#0f1729] text-center",
      render: () => (
        <div className="flex gap-1 justify-center">
          <Button variant="ghost" size="sm" onClick={() => onEdit(s)}>
            <Pencil className="w-3.5 h-3.5 mr-1" /> {t("Edit", "संपादित करें")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-destructive/10"
            onClick={() => onDelete(s)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    };

    return row;
  });

  return <MyTable tableHeaders={tableHeaders} tableBody={tableBody} />;
}
