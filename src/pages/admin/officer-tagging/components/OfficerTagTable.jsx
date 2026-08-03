import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import OfficerTagCards from "./OfficerTagCards";

export default function OfficerTagTable({
  tagging = [],
  setEditItem,
  setDialog,
  handleDelete,
}) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <OfficerTagCards
        tagging={tagging}
        setEditItem={setEditItem}
        setDialog={setDialog}
        handleDelete={handleDelete}
      />
    );
  }

  const tableHeaders = [
    { id: "officer", label: t("Officer", "अधिकारी") },
    { id: "designation", label: t("Designation", "पदनाम") },
    { id: "services", label: t("Sub-services", "उप-सेवाएं"), className: "min-w-60" },
    { id: "wards", label: t("Subdivisions", "अनुमंडल"), className: "min-w-48" },
    { id: "actions", label: t("Actions", "कार्रवाई"), className: "text-center" },
  ];

  const tableBody = tagging.map((o) => ({
    officer: {
      value: o.officer?.name || "N/A",
      className: "font-medium",
    },
    designation: {
      value: o.officer?.role?.designationEnglish || "N/A",
      className: "text-muted-foreground",
    },
    services: {
      render: () => (
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {(o.services || []).length > 0 ? (
            (o.services || []).map((s, si) => (
              <Badge
                key={si}
                variant="outline"
                className="text-[10px] bg-primary/10 text-primary"
              >
                {s.title}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">N/A</span>
          )}
        </div>
      ),
    },
    wards: {
      render: () => (
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {(o.wards || []).length > 0 ? (
            (o.wards || []).map((w, wi) => (
              <Badge
                key={wi}
                variant="outline"
                className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                {w}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">N/A</span>
          )}
        </div>
      ),
    },
    actions: {
      className: "text-center",
      render: () => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditItem(o);
              setDialog({
                officer: o.officer?.name || "",
                designation: o.officer?.role?.designationEnglish || "",
                services: (o.services || []).map((s) => s.title),
                wards: o.wards || [],
                activeComplaints: 0,
                slaCompliant: true,
              });
            }}
          >
            <Pencil className="w-3.5 h-3.5 mr-1" /> {t("Edit", "संपादित करें")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-destructive/10"
            onClick={() => handleDelete && handleDelete(o)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  }));

  return <MyTable tableHeaders={tableHeaders} tableBody={tableBody} />;
}
