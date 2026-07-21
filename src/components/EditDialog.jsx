import React from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export default function EditDialog({ title, onClose, onSave, children, saving, isHideFooter=false }) {
 
  const handleSave = () => {
    
      onSave();
  
  };
  return (
    <div style={{
      margin: 0
    }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center m-0 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className={clsx("p-5 space-y-4 max-h-[90svh] overflow-y-auto", isHideFooter && "pb-0")}>{children}</div>
       {!isHideFooter &&  <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
            <Check className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>}
      </div>
    </div>
  );
}
