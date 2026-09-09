import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import MyTable from "@/components/MyTable";
import { useLanguage } from "@/context/LanguageContext";
import useIsMobile from "@/hooks/useIsMobile";
import ServiceCards from "./ServiceCards";
import { Badge } from "@/components/ui/badge";
// import SubServicesTable from "./SubServicesTable";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import EditButton from "@/components/EditButton";

const ServiceTable = ({
  services = [],
  setServiceDialog,
  setDialog,
  pagination,
  // subServiceDialog,
  // setSubServiceDialog,
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const handleDialog = setServiceDialog || setDialog;

  if (isMobile) {
    return (
      <ServiceCards
        services={services}
        setServiceDialog={handleDialog}
        setDialog={handleDialog}
      />
    );
  }

  const tableHeaders = [
    { id: "title", label: t("Service (English)", "सेवा (अंग्रेज़ी)") },
    { id: "titleHindi", label: t("Service (Hindi)", "सेवा (हिंदी)") },
    { id: "department", label: t("Department", "विभाग") },
    { id: "sla", label: t("SLA", "SLA"), className: "text-center" },
    {
      id: "geoTagged",
      label: t("Geo-Tagged", "भू-टैग किया गया"),
      className: "text-center",
    },
    {
      id: "fieldVisit",
      label: t("Field Visit", "क्षेत्र का दौरा"),
      className: "text-center",
    },
    {
      id: "actions",
      label: t("Actions", "कार्रवाई"),
      className: "text-center w-28",
    },
  ];

  const tableBody = services.map((s) => ({
    title: { className: "font-medium", value: s.title || "N/A" },
    titleHindi: {
      className: "text-muted-foreground",
      value: s.titleHindi || "N/A",
    },
    department: {
      className: "text-muted-foreground",
      value:
        s.department?.title ||
        s.department?.name ||
        (typeof s.department === "string" ? s.department : "N/A") ||
        "N/A",
    },
    sla: {
      className: "text-center",
      render: () =>
        s.sla !== undefined && s.sla !== null ? (
          <Badge
            variant="outline"
            className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-amber-500/30"
          >
            {s?.slaType === "days" ? s.sla / 24 : s.sla}
            {s?.slaType === "days" ? "d" : "h"}
          </Badge>
        ) : (
          "N/A"
        ),
    },
    geoTagged: {
      className: "text-center",
      value: s.geoTagged ? "✅" : "N/A",
    },
    fieldVisit: {
      className: "text-center",
      value: s.fieldVisit ? "✅" : "N/A",
    },
    actions: {
      className: "text-center",
      render: () => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleDialog && handleDialog({ type: "edit", item: s })}
            className="p-1 hover:bg-muted rounded text-primary transition-colors cursor-pointer"
            title={t("Edit Service", "सेवा संपादित करें")}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              handleDialog && handleDialog({ type: "delete", item: s })
            }
            className="p-1 hover:bg-muted rounded text-red-600 hover:text-red-700 transition-colors cursor-pointer"
            title={t("Delete Service", "सेवा हटाएं")}
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

  /*
  // PREVIOUS IMPLEMENTATION WITH SUB-SERVICES (COMMENTED OUT):
  return (
    <div className="space-y-6">
      {services.map((s) => (
        <div
          key={s._id}
          className="bg-card rounded-xl border border-border p-5 pb-0 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-lg text-foreground">{s.title}</h4>
                <span className="text-sm text-muted-foreground">
                  ({s.titleHindi})
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {t("Department:", "विभाग:")}{" "}
                <span className="font-semibold text-primary">
                  {s.department?.title || s.department}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EditButton onClick={() => setServiceDialog({ type: "edit", item: s })} />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-destructive/10"
                onClick={() => setServiceDialog({ type: "delete", item: s })}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSubServiceDialog({ type: "add", item: s })}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" /> {t("Add Sub-service", "उप-सेवा जोड़ें")}
              </Button>
            </div>
          </div>

          <SubServicesTable
            service={s}
            dialog={subServiceDialog}
            setDialog={setSubServiceDialog}
          />
        </div>
      ))}
    </div>
  );
  */
};

export default ServiceTable;
