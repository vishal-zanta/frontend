import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Loader2,
  FileDown,
} from "lucide-react";
import {
  DAILY_VOLUME,
  MONTHLY_VOLUME,
  CATEGORY_DISTRIBUTION,
  HOTSPOTS,
  AI_PREDICTIONS,
  DISTRICT_WISE,
} from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import StatCard from "@/components/StatCard";
import { ChartCard, SectionTitle } from "@/components/ChartCard";
import {
  LineChartCard,
  PieChartCard,
  BarChartCard,
  ScatterChartCard,
  AreaChartCard,
} from "@/components/Charts";
import ComplaintMap from "@/components/ComplaintMap";
import { Button } from "@/components/ui/button";
import TimeRangeFilter from "@/components/TimeRangeFilter";

export default function AIReports() {
  const [period, setPeriod] = useState("weekly");
  const [dateRange, setDateRange] = useState({});
  const [showInsights, setShowInsights] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowInsights(true);
    }, 2000);
  };

  const handleExportPDF = async () => {
    const element = document.querySelector(".ai-report-pdf");
    if (!element) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const children = Array.from(element.children);
      const doc = new jsPDF("p", "mm", "a4");

      const margin = 10; // 10mm margins
      const pageWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const usableWidth = pageWidth - (margin * 2); // 190mm
      const usableHeight = pageHeight - (margin * 2); // 277mm

      let currentY = margin;
      let isFirstPage = true;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        
        // Render the individual child element to a canvas
        const canvas = await html2canvas(child, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        let childHeight = (canvas.height * usableWidth) / canvas.width;

        // If a single child is larger than the usable height, scale it down to fit
        if (childHeight > usableHeight) {
          childHeight = usableHeight;
        }

        // If the child doesn't fit in the remaining space of the current page, add a new page
        if (currentY + childHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
          isFirstPage = false;
        } else if (isFirstPage && i > 0) {
          // Add spacing between elements on the same page
          currentY += 6;
        } else if (!isFirstPage && currentY > margin) {
          // Add spacing between elements on subsequent pages
          currentY += 6;
        }

        doc.addImage(imgData, "PNG", margin, currentY, usableWidth, childHeight, "", "FAST");
        currentY += childHeight;
      }

      doc.save(`AI_Analytical_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title="AI Analytical Reports"
            subtitle="Time-series analysis, category distribution, hotspot prediction & AI-powered insights"
          />
          <div className="flex flex-col  items-end  gap-3">
            <TimeRangeFilter period={period} setPeriod={setPeriod} dateRange={dateRange} setDateRange={setDateRange} />
            <Button
              onClick={handleExportPDF}
              disabled={exporting}
              size={"sm"}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 h-9"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6 ai-report-pdf">

     
        {/* AI Insights - Generate button */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Brain className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-1">
                  AI-Generated Insights
                </h2>
                <p className="text-white/80 text-sm">
                  {period === "weekly" ? "Next Week" : "Next Month"} Volume
                  Prediction & Key Recommendations
                </p>
              </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />{" "}
                  Generating...
                </>
              ) : showInsights ? (
                "Regenerate"
              ) : (
                "Generate Insights"
              )}
            </Button>
          </div>
          {showInsights && !generating && (
            <div className="mt-4 space-y-2">
              {AI_PREDICTIONS.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                  <span className="text-white/90">{insight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title={`Volume Prediction - ${period === "weekly" ? "Next Week" : "Next Month"}`}
            subtitle="AI-predicted complaint volume by department"
          >
            <BarChartCard
              data={
                period === "weekly"
                  ? AI_PREDICTIONS.nextWeek
                  : AI_PREDICTIONS.nextMonth
              }
              xKey="dept"
              bars={[
                {
                  key: "predicted",
                  label: "Predicted Volume",
                  color: "#8b5cf6",
                },
              ]}
              legend={false}
            />
          </ChartCard>
          <ChartCard
            title="Category-wise Distribution"
            subtitle="Grievance distribution by service category"
          >
            <PieChartCard data={CATEGORY_DISTRIBUTION} />
          </ChartCard>
        </div>

        {/* Time-series */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Daily Trend Analysis"
            subtitle="30-day time-series with trend line"
          >
            <LineChartCard
              data={DAILY_VOLUME}
              xKey="label"
              lines={[
                { key: "raised", label: "Raised", color: "#1d4ed8" },
                { key: "resolved", label: "Resolved", color: "#22c55e" },
              ]}
            />
          </ChartCard>
          <ChartCard
            title="Monthly Volume Trend"
            subtitle="6-month raised vs resolved"
          >
            <AreaChartCard
              data={MONTHLY_VOLUME}
              xKey="month"
              areas={[
                { key: "raised", label: "Raised", color: "#1d4ed8" },
                { key: "resolved", label: "Resolved", color: "#22c55e" },
              ]}
            />
          </ChartCard>
        </div>

        {/* Hotspot Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="AI Hotspot & Cluster Map"
            subtitle="Predicted complaint hotspots by ward"
          >
            <ComplaintMap
              height={320}
              showHotspots={true}
              center={[25.5, 85.4]}
              zoom={7}
            />
          </ChartCard>
          <ChartCard
            title="Hotspot Clusters"
            subtitle="Top complaint density areas"
          >
            <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin">
              {HOTSPOTS.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50"
                >
                  <div
                    className={`w-2 h-12 rounded-full ${h.severity === "High" ? "bg-red-500" : h.severity === "Medium" ? "bg-amber-500" : "bg-green-500"}`}
                  ></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{h.ward}</div>
                    <div className="text-xs text-muted-foreground">
                      {h.district} • {h.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{h.complaints}</div>
                    <div className="text-xs text-muted-foreground">
                      complaints
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Scatter */}
        <ChartCard
          title="Population vs Complaint Density"
          subtitle="AI scatter analysis - ULB population rank vs complaint volume"
        >
          <ScatterChartCard
            data={DISTRICT_WISE.map((d) => ({
              x: d.total,
              y: d.escalated,
              z: d.total,
              name: d.district,
            }))}
            xLabel="Total Complaints"
            yLabel="Escalated"
          />
        </ChartCard>

        {/* Prediction confidence with benchmark */}
        <div className="bg-white dark:bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" /> AI Model Confidence
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(period === "weekly"
              ? AI_PREDICTIONS.nextWeek
              : AI_PREDICTIONS.nextMonth
            ).map((p, i) => (
              <div key={i} className="text-center p-3 bg-muted/50 rounded-lg">
                <div
                  className={`text-2xl font-bold ${p.trend === "up" ? "text-red-600 dark:text-red-400" : p.trend === "down" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
                >
                  {p.confidence}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {p.dept}
                </div>
                <div className="flex items-center justify-center gap-1 mt-1 text-xs">
                  {p.trend === "up" ? (
                    <ArrowUp className="w-3 h-3 text-red-500" />
                  ) : p.trend === "down" ? (
                    <ArrowDown className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Minus className="w-3 h-3 text-amber-500" />
                  )}
                  <span
                    className={
                      p.trend === "up"
                        ? "text-red-500"
                        : p.trend === "down"
                          ? "text-emerald-500"
                          : "text-amber-500"
                    }
                  >
                    {p.trend}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 border-t border-border pt-1">
                  Benchmark: 85% |{" "}
                  {p.confidence >= 85
                    ? "✓ Above"
                    : `${85 - p.confidence}% below`}
                </div>
              </div>
            ))}
          </div>
        </div>
           </div>
      </div>
    </PortalLayout>
  );
}
