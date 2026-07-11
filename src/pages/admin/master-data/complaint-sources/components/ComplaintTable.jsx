import { Globe, Pencil, Trash2 } from "lucide-react";
import React from "react";

const ComplaintTable = ({ rawSources = [], setDialog }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {rawSources.map((s) => (
        <div
          key={s._id}
          className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 group bg-card transition-all duration-200 shadow-sm"
        >
          <Globe className="w-5 h-5 text-primary shrink-0" />
          <span className="text-sm font-medium flex-1 truncate">{s.title}</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setDialog({ type: "edit", item: s })}
              className="p-1 hover:bg-muted rounded"
            >
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setDialog({ type: "delete", item: s })}
              className="p-1 hover:bg-muted rounded text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintTable;
