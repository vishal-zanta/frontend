import React from "react";
import SubServicesTable from "./SubServicesTable";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";

const ServiceTable = ({
  services = [],
  setServiceDialog,
  subServiceDialog,
  setSubServiceDialog,
}) => {
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
                Department:{" "}
                <span className="font-semibold text-primary">
                  {s.department?.title || s.department}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setServiceDialog({ type: "edit", item: s })}
                className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
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
                className="border-primary text-primary hover:bg-primary/5 hover:text-primary-foreground transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Sub-service
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
};

export default ServiceTable;
