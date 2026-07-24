import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import clsx from "clsx";

export default function EditDialog({
  title,
  onClose,
  onSave,
  children,
  saving,
  isHideFooter = false,
  open = true,
}) {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val && onClose) onClose();
      }}
    >
      <DialogContent className="max-w-md max-h-[90svh] p-0 gap-0 overflow-hidden flex flex-col sm:rounded-2xl">
        <DialogHeader className="px-5 py-3.5 border-b border-border text-left pr-10 space-y-0 flex-shrink-0">
          <DialogTitle className="font-bold text-foreground text-base">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div
          className={clsx(
            "p-5 space-y-4 overflow-y-auto flex-1 max-h-[calc(90svh-110px)]",
            isHideFooter && "pb-0"
          )}
        >
          {children}
        </div>

        {!isHideFooter && (
          <DialogFooter className="px-5 py-3 border-t  border-border flex flex-row gap-2 justify-end sm:justify-end flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
