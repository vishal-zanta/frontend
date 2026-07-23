import React, { useState, useEffect } from "react";
import { Coffee, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BreakOverlay({onEndBreak, isEnding, activeBreak }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
// console.log({activeBreak});
  const startTime = activeBreak?.startTime 

  useEffect(() => {
    const startTimestamp = startTime ? new Date(startTime).getTime() : Date.now();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((now - startTimestamp) / 1000);
      setSecondsElapsed(diff > 0 ? diff : 0);
    };

    // Run once immediately
    updateTimer();

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h > 0 ? String(h).padStart(2, "0") : null,
      String(m).padStart(2, "0"),
      String(s).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-[9999] backdrop-blur-md flex flex-col items-center justify-center text-white pointer-events-auto select-none">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center animate-pulse">
            <Coffee className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Active Break</h2>
          <p className="text-slate-400 text-sm">
            Your status is set to "On Break". Return to available status when you're ready.
          </p>
        </div>

        <div className="py-4">
          <div className="text-6xl font-mono font-bold tracking-widest text-amber-400">
            {formatTime(secondsElapsed)}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1.5">
            Duration Elapsed
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center">
          <Button
            size="lg"
            onClick={onEndBreak}
            disabled={isEnding}
            className="bg-amber-500 hover:bg-amber-600 text-slate-955 font-semibold px-8 py-3 rounded-full flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {isEnding ? "Ending Break..." : "End Break"}
          </Button>
        </div>
      </div>
    </div>
  );
}
