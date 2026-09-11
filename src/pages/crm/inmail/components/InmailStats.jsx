import React from "react";
import { Inbox, Clock, CheckCircle2, XCircle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useLanguage } from "@/context/LanguageContext";

export default function InmailStats({ stats, activeTab, onTabChange }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      <StatCard
        icon={Inbox}
        label={t("Total Inmails", "कुल इनमेल")}
        value={stats.total}
        color="blue"
        isClicked={activeTab === "all"}
        onClick={() => onTabChange("all")}
      />
      <StatCard
        icon={Clock}
        label={t("Pending Action", "लंबित कार्रवाई")}
        value={stats.pending}
        color="amber"
        isClicked={activeTab === "pending"}
        onClick={() => onTabChange("pending")}
      />
      <StatCard
        icon={CheckCircle2}
        label={t("Converted to Complaint", "शिकायत में परिवर्तित")}
        value={stats.converted}
        color="green"
        isClicked={activeTab === "converted"}
        onClick={() => onTabChange("converted")}
      />
      <StatCard
        icon={XCircle}
        label={t("Rejected", "अस्वीकृत")}
        value={stats.rejected}
        color="red"
        isClicked={activeTab === "rejected"}
        onClick={() => onTabChange("rejected")}
      />
      <StatCard
        icon={CheckCircle2}
        label={t("Closed", "बंद")}
        value={stats.closed}
        color="purple"
        isClicked={activeTab === "closed"}
        onClick={() => onTabChange("closed")}
      />
    </div>
  );
}
