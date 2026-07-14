import React from "react";

export default function Avatar({ initials, size = "md", online = false }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  return (
    <div className="relative shrink-0">
      <div className={`${sz} rounded-full bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center text-white font-bold select-none`}>
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}
