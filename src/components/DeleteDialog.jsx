import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function DeleteDialog({
  title,
  onClose,
  onDelete,
  deleting,
  open = true,
}) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val && onClose) onClose();
      }}
    >
      <DialogContent className="max-w-sm p-6 text-center sm:rounded-2xl">
        <DialogHeader className="text-center sm:text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <DialogTitle className="font-bold text-foreground text-center mb-1 text-lg">
            Delete "{title}"?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mb-1 text-center">
            This action cannot be undone. The record will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2 sm:justify-stretch mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
