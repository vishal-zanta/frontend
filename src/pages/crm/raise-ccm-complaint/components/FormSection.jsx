import React from "react";

export default function FormSection({ title, children }) {
  return (
    <div className="rounded-lg xs:rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 px-3 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-3">
        <h2 className="text-white font-semibold text-xs xs:text-xs sm:text-sm tracking-wide uppercase">
          {title}
        </h2>
      </div>
      <div className="p-3 xs:p-4 sm:p-5 space-y-3 xs:space-y-4">{children}</div>
    </div>
  );
}
