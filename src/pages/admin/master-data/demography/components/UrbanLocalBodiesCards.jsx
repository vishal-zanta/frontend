import React from "react";
import { Button } from "@/components/ui/button";
import EditButton from "@/components/EditButton";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function UrbanLocalBodiesCards({ ulbs = [], districts = [], setDialog }) {
  const { t } = useLanguage();

  if (!ulbs || ulbs.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No ULBs configured yet.", "अभी तक कोई यूएलबी कॉन्फ़िगर नहीं किया गया है।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {ulbs.map((u) => {
        const districtObj =
          typeof u.district === "object"
            ? u.district
            : districts.find(
                (d) => d._id === u.district || d.id === u.district
              );
        const districtName = districtObj?.name || "N/A";
        const districtPopulation = districtObj?.population;

        return (
          <Card
            key={u._id}
            item={u}
            districtName={districtName}
            districtPopulation={districtPopulation}
            setDialog={setDialog}
            t={t}
          />
        );
      })}
    </div>
  );
}

function Card({ item, districtName, districtPopulation, setDialog, t }) {
  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm text-foreground">
            {item.name || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {item.nameHindi || "N/A"}
          </div>
        </div>
      </div>

      <div className="p-3 xs:p-3.5 sm:p-4">
        <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium">
              {t("District", "जिला")}
            </span>
            <span className="font-medium text-foreground capitalize truncate block">{districtName}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium">
              {t("Wards", "वार्ड")}
            </span>
            <span className="font-medium text-foreground truncate block">{item.wards ?? "N/A"}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground block text-[10px] uppercase font-medium">
              {t("Population", "जनसंख्या")}
            </span>
            <span className="font-semibold text-foreground truncate block">
              {districtPopulation ? districtPopulation.toLocaleString("en-IN") : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end gap-1.5">
        <EditButton onClick={() => setDialog({ type: "edit", item })} />
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => setDialog({ type: "delete", item })}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {t("Delete", "हटाएं")}
        </Button>
      </div>
    </div>
  );
}
