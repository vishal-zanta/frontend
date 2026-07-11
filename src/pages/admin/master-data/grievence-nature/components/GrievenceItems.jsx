import { FileHeart, Pencil, Trash2 } from "lucide-react";
import React from "react";

const GrievenceItems = ({ rawItems = [], setDialog }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-2">
      {rawItems.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 group bg-card transition-all duration-200 shadow-sm"
        >
          <FileHeart className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.title}</p>
            {item.type && (
              <p className="text-xs text-muted-foreground truncate">
                {item.type}
              </p>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setDialog({ type: "edit", item })}
              className="p-1 hover:bg-muted rounded"
            >
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setDialog({ type: "delete", item })}
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

export default GrievenceItems;
