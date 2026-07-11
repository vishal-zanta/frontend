import React from "react";
import { Link } from "react-router-dom";
import { FileText, Search, Bot, MessageSquare } from "lucide-react";
import { getCitizenComplaints } from "@/lib/complaintStore";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function CitizenDashboard() {
  const { t, lang, toggle } = useLanguage();
  const allComplaints = getCitizenComplaints("Ramesh Prasad");
  const inProgress = allComplaints.filter((c) =>
    ["In Progress", "Assigned", "Field Visit", "Pending"].includes(c.status),
  );
  const resolved = allComplaints.filter((c) =>
    ["Resolved", "Closed"].includes(c.status),
  );
  const escalated = allComplaints.filter((c) => c.status === "Escalated");

  const stats = [
    {
      label: t("Total Filed", "कुल दर्ज"),
      value: allComplaints.length,
      color: "text-primary",
      bg: "bg-blue-50",
      filter: "all",
    },
    {
      label: t("In Progress", "प्रगति पर"),
      value: inProgress.length,
      color: "text-amber-600",
      bg: "bg-amber-50",
      filter: "in_progress",
    },
    {
      label: t("Resolved", "हल"),
      value: resolved.length,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      filter: "resolved",
    },
    {
      label: t("Escalated", "स्थानांतरित"),
      value: escalated.length,
      color: "text-red-600",
      bg: "bg-red-50",
      filter: "escalated",
    },
  ];

  return (
    <PortalLayout role="citizen">
      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-6 text-white flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {t("Namaste, Ramesh Prasad!", "नमस्ते, रमेश प्रसाद!")}
            </h1>
            <p className="text-white/80 text-sm">
              {t(
                "Welcome to your citizen dashboard. File complaints, track status, and get assistance - all in one place.",
                "अपने नागरिक डैशबोर्ड में आपका स्वागत है। शिकायत दर्ज करें, स्थिति ट्रैक करें, और सहायता प्राप्त करें।",
              )}
            </p>
          </div>
          <button
            onClick={toggle}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-white font-medium whitespace-nowrap"
          >
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/citizen/raise"
            className="group bg-white rounded-xl border-2 border-blue-100 hover:border-primary p-6 transition-all hover:shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground">
              {t("Raise a Complaint", "शिकायत दर्ज करें")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("3-step form - quick & easy", "3-चरण फॉर्म - त्वरित और आसान")}
            </p>
          </Link>

          <Link
            to="/citizen/track"
            className="group bg-white rounded-xl border-2 border-emerald-100 hover:border-emerald-400 p-6 transition-all hover:shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground">
              {t("Track a Complaint", "शिकायत ट्रैक करें")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("View status & timeline", "स्थिति और समयरेखा देखें")}
            </p>
          </Link>

          <div
            className="group bg-white rounded-xl border-2 border-purple-100 hover:border-purple-400 p-6 transition-all hover:shadow-lg cursor-pointer"
            onClick={() =>
              document
                .querySelector("[class*='fixed bottom-6 right-6']")
                ?.click()
            }
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground">
              {t("AI Assistant", "सहायक")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t(
                "Chat & file complaints via chat",
                "चैट के माध्यम से शिकायत दर्ज करें",
              )}
            </p>
          </div>

          <Link
            to="/citizen/feedback"
            className="group bg-white rounded-xl border-2 border-amber-100 hover:border-amber-400 p-6 transition-all hover:shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground">
              {t("Feedback", "प्रतिक्रिया")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("Share your experience", "अपना अनुभव साझा करें")}
            </p>
          </Link>
        </div>

        {/* Clickable stat boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Link
              key={i}
              to={`/citizen/track?status=${s.filter}`}
              className="bg-white rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Quick track shortcut */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">
              {t(
                "Want to check your complaint status?",
                "अपनी शिकायत की स्थिति जांचना चाहते हैं?",
              )}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t(
                "Enter your Complaint ID on the Track page to view full timeline & status.",
                "पूरी समयरेखा और स्थिति देखने के लिए ट्रैक पृष्ठ पर अपनी शिकायत आईडी दर्ज करें।",
              )}
            </p>
          </div>
          <Link to="/citizen/track">
            <Button className="bg-primary hover:bg-primary/90">
              <Search className="w-4 h-4 mr-1" />{" "}
              {t("Track Complaint", "शिकायत ट्रैक करें")}
            </Button>
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
