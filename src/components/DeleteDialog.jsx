import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteDialog({ title, onClose, onDelete, deleting }) {
 
  const handleDelete = () => {
      onDelete();
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-foreground mb-1">Delete "{title}"?</h3>
        <p className="text-sm text-muted-foreground mb-5">This action cannot be undone. The record will be permanently removed.</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700">
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
