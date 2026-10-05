import React from "react";
import moment from "moment";
import EditDialog from "@/components/EditDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import {
  getStatusBadgeConfig,
  getScreenStateBadgeConfig,
} from "../helpers";

const ViewTrackAgentDialog = ({ agent, onClose }) => {
  const { t } = useLanguage();

  if (!agent) return null;

  const statusConfig = getStatusBadgeConfig(agent.currentStatus, t);
  const screenConfig = getScreenStateBadgeConfig(agent.screenState, t);


  return (
    <EditDialog
      title={t("Agent Details", "एजेंट विवरण")}
      onClose={onClose}
      isHideFooter={true}
      bodyClassname="max-w-lg"
    >
      <div className="space-y-4 py-1 pb-4">
        {/* Header Profile Card */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
          <div className="w-12 h-12 rounded-full bg-[#102a54] dark:bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            {agent.name ? agent.name.slice(0, 2).toUpperCase() : "AG"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-foreground text-base truncate">
                {agent.name || "-"}
              </h4>
              <Badge
                variant="outline"
                className={`text-xs px-2.5 py-0.5 font-medium ${statusConfig.badgeClass}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${statusConfig.dotClass}`}
                />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("CCE ID", "सीसीई आईडी")}:{" "}
              <span className="font-semibold text-foreground">
                {agent.userCode || agent._id}
              </span>
            </p>
          </div>
        </div>

        {/* Status and State Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-lg border border-border bg-card">
            <span className="text-muted-foreground block text-[11px] mb-1">
              {t("Current Status", "वर्तमान स्थिति")}
            </span>
            <span className="font-semibold text-foreground">
              {statusConfig.label}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card">
            <span className="text-muted-foreground block text-[11px] mb-1">
              {t("Screen State", "स्क्रीन स्थिति")}
            </span>
            <span className="font-semibold text-foreground">
              {screenConfig.label}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card">
            <span className="text-muted-foreground block text-[11px] mb-1">
              {t("Online Status", "ऑनलाइन स्थिति")}
            </span>
            <span
              className={`font-semibold ${
                agent.isOnline
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              {agent.isOnline ? t("Online", "ऑनलाइन") : t("Offline", "ऑफ़लाइन")}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card">
            <span className="text-muted-foreground block text-[11px] mb-1">
              {t("Screen Active", "स्क्रीन सक्रिय")}
            </span>
            <span
              className={`font-semibold ${
                agent.isActiveOnScreen
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              {agent.isActiveOnScreen ? t("Yes", "हाँ") : t("No", "नहीं")}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card">
            <span className="text-muted-foreground block text-[11px] mb-1">
              {t("Break Status", "ब्रेक स्थिति")}
            </span>
            <span
              className={`font-semibold ${
                agent.isBreak
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-foreground"
              }`}
            >
              {agent.isBreak ? t("On Break", "ब्रेक पर") : t("Working", "कार्यरत")}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card">
            <span className="text-muted-foreground block text-[11px] mb-1">
              {t("Last Active", "अंतिम सक्रिय")}
            </span>
            <span className="font-semibold text-foreground">
              {agent.lastActive
                ? moment(agent.lastActive).format("DD MMM YYYY, hh:mm A")
                : "-"}
            </span>
          </div>
        </div>

        {/* Supervisor Info */}
        <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
          <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            {t("Supervisor Details", "पर्यवेक्षक विवरण")}
          </h5>
          {agent.supervisor ? (
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {agent.supervisor.name
                  ? agent.supervisor.name.slice(0, 2).toUpperCase()
                  : "SV"}
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">
                  {agent.supervisor.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("Code", "कोड")}:{" "}
                  {agent.supervisor.userCode || agent.supervisor._id || "-"}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic py-1">
              {t("No supervisor assigned", "कोई पर्यवेक्षक आवंटित नहीं")}
            </p>
          )}
        </div>



        {/* Timestamps */}
        <div className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-xs">
          <h5 className="font-semibold text-muted-foreground uppercase tracking-wider">
            {t("Session Timestamps", "सत्र समय")}
          </h5>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center py-0.5 ">
              <span className="text-muted-foreground">
                {t("Last Login Time", "अंतिम लॉगिन समय")}:
              </span>
              <span className="font-medium text-foreground">
                {agent.lastLogin
                  ? moment(agent.lastLogin).format("DD MMM YYYY, hh:mm:ss A")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground">
                {t("Last Logout Time", "अंतिम लॉगआउट समय")}:
              </span>
              <span className="font-medium text-foreground">
                {agent.lastLogout
                  ? moment(agent.lastLogout).format("DD MMM YYYY, hh:mm:ss A")
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* <div className="pt-2 flex justify-end sticky bottom-0 pb-4 bg-white">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("Close", "बंद करें")}
          </Button>
        </div> */}
      </div>
    </EditDialog>
  );
};

export default ViewTrackAgentDialog;
