import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Loader2,
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
  const [showInsights, setShowInsights] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowInsights(true);
    }, 2000);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title="AI Analytical Reports"
            subtitle="Time-series analysis, category distribution, hotspot prediction & AI-powered insights"
          />
          <TimeRangeFilter period={period} setPeriod={setPeriod} />
        </div>

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
    </PortalLayout>
  );
}
