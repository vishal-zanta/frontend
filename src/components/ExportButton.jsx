import React, { useState } from "react";
import { Download, FileSpreadsheet, FileDown, Loader2, Check } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

function toCSV(data, columns) {
  const header = columns.map(c => c.label).join(",");
  const rows = data.map(row =>
    columns.map(c => {
      const val = typeof c.key === "function" ? c.key(row) : row[c.key];
      const str = val == null ? "" : String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportButton({ data, columns, filename = "export" }) {
  const [exporting, setExporting] = useState(null);
  const [done, setDone] = useState(null);

  const handleExport = (format) => {
    setExporting(format);
    setTimeout(() => {
      if (format === "csv") {
        downloadFile(toCSV(data, columns), `${filename}.csv`, "text/csv");
      } else {
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        doc.setFontSize(14);
        doc.text("Bihar e-Grievance Portal", 14, 15);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Report: ${filename} • Generated: ${new Date().toLocaleString("en-IN")}`, 14, 22);

        const pageWidth = doc.internal.pageSize.getWidth();
        const colWidth = (pageWidth - 28) / columns.length;
        let y = 32;

        doc.setFillColor(30, 58, 95);
        doc.rect(14, y - 5, pageWidth - 28, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        columns.forEach((c, i) => {
          doc.text(String(c.label).substring(0, 25), 14 + i * colWidth, y);
        });

        doc.setTextColor(0, 0, 0);
        data.forEach((row, ri) => {
          y += 7;
          if (y > 195) { doc.addPage(); y = 20; }
          if (ri % 2 === 0) { doc.setFillColor(245, 245, 245); doc.rect(14, y - 5, pageWidth - 28, 7, "F"); }
          columns.forEach((c, i) => {
            const val = typeof c.key === "function" ? c.key(row) : row[c.key];
            doc.text(String(val ?? "").substring(0, 25), 14 + i * colWidth, y);
          });
        });

        doc.save(`${filename}.pdf`);
      }
      setExporting(null);
      setDone(format);
      setTimeout(() => setDone(null), 2000);
    }, 600);
  };

  if (done) {
    const isCsv = done === "csv";
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className={isCsv ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-rose-200 bg-rose-50 text-rose-600"}
      >
        <Check className="w-3.5 h-3.5" />
      </Button>
    );
  }

  return (
    <div className="flex gap-1.5">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleExport("csv")}
        disabled={!!exporting}
        title="Download CSV"
        className="hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
      >
        {exporting === "csv" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        ) : (
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleExport("pdf")}
        disabled={!!exporting}
        title="Download PDF"
        className="hover:bg-rose-50 border-slate-200 hover:border-rose-300 hover:text-rose-700 transition-colors"
      >
        {exporting === "pdf" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
        ) : (
          <FileDown className="w-3.5 h-3.5 text-rose-600" />
        )}
      </Button>
    </div>
  );
}