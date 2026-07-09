import React from "react";
import { GitBranch, ArrowRight } from "lucide-react";

export default function EscalationFlow({ levels = [] }) {
  const sortedLevels = [...levels].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <GitBranch className="w-5 h-5 text-blue-500" /> Escalation Flow
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        {sortedLevels.map((level, i) => {
          const title = level.role?.designationEnglish || level.description || "—";
          const levelName = level.role?.level || `L${level.order}`;
          return (
            <React.Fragment key={level._id || i}>
              <div className="flex flex-col items-center min-w-[120px]">
                <div
                  className="px-4 py-3 rounded-xl text-center text-sm font-medium text-white w-full"
                  style={{
                    backgroundColor:
                      i === 0
                        ? "#059669"
                        : i === sortedLevels.length - 1
                        ? "#dc2626"
                        : `hsl(${217 - i * 12}, 80%, ${45 - i * 3}%)`,
                  }}
                >
                  <div className="text-xs opacity-80">
                    Level {level.order} ({levelName})
                  </div>
                  <div className="text-xs font-bold leading-tight truncate max-w-[150px]">
                    {title}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 text-center truncate max-w-[120px]">
                  {level.description}
                </div>
              </div>
              {i < sortedLevels.length - 1 && (
                <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
