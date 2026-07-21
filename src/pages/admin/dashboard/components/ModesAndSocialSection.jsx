import React from "react";
import { MessageSquare, Newspaper, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/ChartCard";
import ModeWiseComplaintsChart from "./charts/ModeWiseComplaintsChart";
import { SOCIAL_COMPLAINTS } from "@/lib/biharData";

export default function ModesAndSocialSection({ modeData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ModeWiseComplaintsChart mainData={modeData} />
      <ChartCard
        title="Social Media Complaints"
        subtitle="Latest from Twitter, WhatsApp, Instagram & Newspaper"
        actions={
          <Button variant="ghost" size="sm">
            View All
          </Button>
        }
      >
        <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin">
          {SOCIAL_COMPLAINTS.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                {s.platform.includes("Twitter") ? (
                  <MessageSquare className="w-4 h-4" />
                ) : s.platform.includes("News") ? (
                  <Newspaper className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{s.handle}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {s.platform}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {s.text}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] shrink-0 ${s.status === "Converted" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
              >
                {s.status}
              </Badge>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
