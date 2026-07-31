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
import { useLanguage } from "@/context/LanguageContext";

export default function AIReports() {
  const { t } = useLanguage();
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
      const usableWidth = 210 - margin * 2;
      const pageHeight = 297 - margin * 2;

      let currentY = margin;
      let isFirstPage = true;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const canvas = await html2canvas(child, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const childHeight = (canvas.height * usableWidth) / canvas.width;

        if (currentY + childHeight > pageHeight + margin && !isFirstPage) {
          doc.addPage();
          currentY = margin;
        } else if (currentY + childHeight > pageHeight + margin && isFirstPage) {
          doc.addPage();
          currentY = margin;
          isFirstPage = false;
        } else if (isFirstPage && i > 0) {
          currentY += 6;
        } else if (!isFirstPage && currentY > margin) {
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
            title={t("AI Analytical Reports", "AI विश्लेषणात्मक रिपोर्ट")}
            subtitle={t("Time-series analysis, category distribution, hotspot prediction & AI-powered insights", "समय-श्रृंखला विश्लेषण, श्रेणी वितरण, हॉटस्पॉट भविष्यवाणी और AI अंतर्दृष्टि")}
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
                  <span>{t("Exporting...", "निर्यात किया जा रहा है...")}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{t("Export PDF", "PDF निर्यात करें")}</span>
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
                  {t("AI-Generated Insights", "AI द्वारा जनरेट की गई अंतर्दृष्टि")}
                </h2>
                <p className="text-white/80 text-sm">
                  {period === "weekly" ? t("Next Week", "अगले सप्ताह") : t("Next Month", "अगले महीने")} {t("Volume Prediction & Key Recommendations", "मात्रा पूर्वानुमान और मुख्य सिफारिशें")}
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
                  {t("Generating...", "जनरेट हो रहा है...")}
                </>
              ) : showInsights ? (
                t("Regenerate", "पुनः जनरेट करें")
              ) : (
                t("Generate Insights", "अंतर्दृष्टि जनरेट करें")
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
            title={`${t("Volume Prediction", "मात्रा पूर्वाअनुमान")} - ${period === "weekly" ? t("Next Week", "अगले सप्ताह") : t("Next Month", "अगले महीने")}`}
            subtitle={t("AI-predicted complaint volume by department", "विभाग द्वारा AI-पूर्वाअनुमानित शिकायत की मात्रा")}
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
                  label: t("Predicted Volume", "पूर्वाअनुमानित मात्रा"),
                  color: "#8b5cf6",
                },
              ]}
              legend={false}
            />
          </ChartCard>
          <ChartCard
            title={t("Category-wise Distribution", "श्रेणी-वार विवरण")}
            subtitle={t("Grievance distribution by service category", "सेवा श्रेणी द्वारा शिकायत विवरण")}
          >
            <PieChartCard data={CATEGORY_DISTRIBUTION} />
          </ChartCard>
        </div>

        {/* Time-series */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title={t("Daily Trend Analysis", "दैनिक रुझान विश्लेषण")}
            subtitle={t("30-day time-series with trend line", "रुझान रेखा के साथ 30-दिवसीय समय-श्रृंखला")}
          >
            <LineChartCard
              data={DAILY_VOLUME}
              xKey="label"
              lines={[
                { key: "raised", label: t("Raised", "दर्ज"), color: "#1d4ed8" },
                { key: "resolved", label: t("Resolved", "निराकृत"), color: "#22c55e" },
              ]}
            />
          </ChartCard>
          <ChartCard
            title={t("Monthly Volume Trend", "मासिक मात्रा का रुझान")}
            subtitle={t("6-month raised vs resolved", "6 महीने में दर्ज बनाम निराकृत")}
          >
            <AreaChartCard
              data={MONTHLY_VOLUME}
              xKey="month"
              areas={[
                { key: "raised", label: t("Raised", "दर्ज"), color: "#1d4ed8" },
                { key: "resolved", label: t("Resolved", "निराकृत"), color: "#22c55e" },
              ]}
            />
          </ChartCard>
        </div>

        {/* Hotspot Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title={t("AI Hotspot & Cluster Map", "AI हॉटस्पॉट और क्लस्टर मानचित्र")}
            subtitle={t("Predicted complaint hotspots by ward", "वार्ड द्वारा पूर्वाअनुमानित शिकायत हॉटस्पॉट")}
          >
            <ComplaintMap
              height={320}
              showHotspots={true}
              center={[25.5, 85.4]}
              zoom={7}
            />
          </ChartCard>
          <ChartCard
            title={t("Hotspot Clusters", "हॉटस्पॉट क्लस्टर्स")}
            subtitle={t("Top complaint density areas", "शीर्ष शिकायत घनत्व क्षेत्र")}
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
                      {t("complaints", "शिकायतें")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Scatter */}
        <ChartCard
          title={t("Population vs Complaint Density", "जनसंख्या बनाम शिकायत घनत्व")}
          subtitle={t("AI scatter analysis - ULB population rank vs complaint volume", "AI प्रकीर्णन विश्लेषण - ULB जनसंख्या रैंक बनाम शिकायत मात्रा")}
        >
          <ScatterChartCard
            data={DISTRICT_WISE.map((d) => ({
              x: d.total,
              y: d.escalated,
              z: d.total,
              name: d.district,
            }))}
            xLabel={t("Total Complaints", "कुल शिकायतें")}
            yLabel={t("Escalated", "बढ़ाई गई")}
          />
        </ChartCard>

        {/* Prediction confidence with benchmark */}
        <div className="bg-white dark:bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" /> {t("AI Model Confidence", "AI मॉडल विश्वसनीयता")}
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
                  {t("Benchmark: 85%", "मानक: 85%")} |{" "}
                  {p.confidence >= 85
                    ? t("✓ Above", "✓ ऊपर")
                    : `${85 - p.confidence}% ${t("below", "नीचे")}`}
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
