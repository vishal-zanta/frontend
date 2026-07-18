import React from "react";

export default function ComplaintClassificationSection({ departmentText, occurrenceDate }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs bg-muted/20 p-2.5 lg:p-3 rounded-lg border border-border">
      <div>
        <span className="text-muted-foreground block font-medium">Department</span>
        <span className="font-semibold text-foreground">{departmentText}</span>
      </div>
     
      <div>
        <span className="text-muted-foreground block font-medium">Occurrence Date</span>
        <span className="font-semibold text-foreground">{occurrenceDate}</span>
      </div>
    </div>
  );
}
