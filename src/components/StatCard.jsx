import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import clsx from "clsx";

export default function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
  color = "blue",
  trendValue,
  onClick,
  isClicked = false
}) {
  const colorMap = {
    blue: {
      bg: isClicked ? "bg-blue-500/20" : "bg-blue-500/10",
      text: "text-blue-600",
      ring: isClicked ? "ring-blue-500/40" : "ring-blue-500/20",
      card: isClicked
        ? "bg-blue-50/60 dark:bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
        : "bg-card border-border hover:shadow-lg",
    },
    green: {
      bg: isClicked ? "bg-emerald-500/20" : "bg-emerald-500/10",
      text: "text-emerald-600",
      ring: isClicked ? "ring-emerald-500/40" : "ring-emerald-500/20",
      card: isClicked
        ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
        : "bg-card border-border hover:shadow-lg",
    },
    emerald: {
      bg: isClicked ? "bg-emerald-500/20" : "bg-emerald-500/10",
      text: "text-emerald-600",
      ring: isClicked ? "ring-emerald-500/40" : "ring-emerald-500/20",
      card: isClicked
        ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
        : "bg-card border-border hover:shadow-lg",
    },
    amber: {
      bg: isClicked ? "bg-amber-500/20" : "bg-amber-500/10",
      text: "text-amber-600",
      ring: isClicked ? "ring-amber-500/40" : "ring-amber-500/20",
      card: isClicked
        ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
        : "bg-card border-border hover:shadow-lg",
    },
    red: {
      bg: isClicked ? "bg-red-500/20" : "bg-red-500/10",
      text: "text-red-600",
      ring: isClicked ? "ring-red-500/40" : "ring-red-500/20",
      card: isClicked
        ? "bg-red-50/60 dark:bg-red-950/30 border-red-500 ring-2 ring-red-500/20 shadow-md"
        : "bg-card border-border hover:shadow-lg",
    },
    purple: {
      bg: isClicked ? "bg-purple-500/20" : "bg-purple-500/10",
      text: "text-purple-600",
      ring: isClicked ? "ring-purple-500/40" : "ring-purple-500/20",
      card: isClicked
        ? "bg-purple-50/60 dark:bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/20 shadow-md"
        : "bg-card border-border hover:shadow-lg",
    },
    sky: {
      bg: isClicked ? "bg-sky-500/20" : "bg-sky-500/10",
      text: "text-sky-600",
      ring: isClicked ? "ring-sky-500/40" : "ring-sky-500/20",
      card: isClicked
        ? "bg-sky-50/60 dark:bg-sky-950/30 border-sky-500 ring-2 ring-sky-500/20 shadow-md"
        : "bg-card border-border hover:shadow-lg",
    },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={(e) => {
        onClick && onClick(e);
      }}
      className={clsx(
        "rounded-lg xs:rounded-xl border p-2.5 xs:p-3 sm:p-4 md:p-5 transition-all relative flex flex-col items-center justify-between",
        c.card,
        onClick && "cursor-pointer"
      )}
    >
      {Icon && (
        <div
          className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center ring-2 ${c.ring} mb-1.5 xs:mb-2`}
        >
          <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
        </div>
      )}
      {trend && (
        <div
          className={`flex items-center justify-center gap-1 text-[10px] xs:text-[11px] sm:text-xs font-medium mb-1 xs:mb-1.5 sm:mb-2 ${
            trend === "up"
              ? "text-emerald-600"
              : trend === "down"
                ? "text-red-600"
                : "text-muted-foreground"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
          ) : trend === "down" ? (
            <TrendingDown className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
          ) : (
            <Minus className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
          )}
          {trendValue}
        </div>
      )}
      <div
        className={`text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight ${!Icon ? c.text : "text-foreground"}`}
      >
        {value}
      </div>
      <div className="text-xs xs:text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 text-center font-medium line-clamp-2">
        {label}
      </div>
      {sublabel && (
        <div className="text-[10px] xs:text-[11px] sm:text-xs text-muted-foreground/70 mt-0.5 xs:mt-1 text-center">
          {sublabel}
        </div>
      )}
    </div>
  );
}
