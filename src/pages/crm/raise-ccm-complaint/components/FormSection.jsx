import React from "react";

export default function FormSection({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 px-5 py-3">
        <h2 className="text-white font-semibold text-sm tracking-wide uppercase">
          {title}
        </h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}
