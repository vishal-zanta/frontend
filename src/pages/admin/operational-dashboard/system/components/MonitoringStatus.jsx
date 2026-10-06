import React, { useState } from "react";
import moment from "moment";
import clsx from "clsx";
import { Activity, Clock } from "lucide-react";
import MyTable from "@/components/MyTable";
import { Badge } from "@/components/ui/badge";
import EditDialog from "@/components/EditDialog";
import { useLanguage } from "@/context/LanguageContext";

const MonitoringStatus = ({ services = [] }) => {
  const { t } = useLanguage();
  const [openDialog, setOpenDialog] =  useState(null);

  const tableHeaders = [
    { id: "name", label: t("Service Name", "सेवा का नाम") },
    { id: "status", label: t("Status", "स्थिति") },
    { id: "upSince", label: t("Up Since", "सक्रिय समय से") },
    { id: "checkedAt", label: t("Last Checked At", "अंतिम जांच समय") },
    { id: "responseTime", label: t("Response Time", "प्रतिक्रिया समय") },
  ];

  const tableBody = (services || []).map((service) => {
    const isUp = Boolean(service?.isUp);
    const upSinceFormatted =
      service?.upSince && moment(service.upSince).isValid()
        ? moment(service.upSince).format("DD MMM YYYY, hh:mm A")
        : "N/A";
    const checkedAtFormatted =
      service?.checkedAt && moment(service.checkedAt).isValid()
        ? moment(service.checkedAt).format("DD MMM YYYY, hh:mm A")
        : "N/A";

    return {
      name: {
        render: () => (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">
              {service?.name || "N/A"}
            </span>
            {service?.url && (
              <span
                className="text-xs text-muted-foreground  truncate max-w-xs"
                title={service.url}
              >
                {service.url}
              </span>
            )}
          </div>
        ),
      },
      status: {
        render: () => (
          <Badge
            variant="outline"
            className={clsx(
              "text-xs inline-flex items-center gap-1.5 font-medium px-2 py-0.5",
              isUp
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20",
            )}
          >
            <span
              className={clsx(
                "w-1.5 h-1.5 rounded-full",
                isUp ? "bg-emerald-500 animate-pulse" : "bg-destructive",
              )}
            />
            {isUp ? service?.status || "UP" : service?.status || "DOWN"}
          </Badge>
        ),
      },
      upSince: {
        render: () => (
          <div className="flex flex-col">
            <span className=" text-xs text-foreground">
              {upSinceFormatted}
            </span>
            {service?.uptimeFormatted && (
              <span className="text-[11px] text-muted-foreground">
                {service.uptimeFormatted}
              </span>
            )}
          </div>
        ),
      },
      checkedAt: {
        render: () => (
          <div className="flex flex-col">
            <span className=" text-xs text-foreground">
              {checkedAtFormatted}
            </span>
            {service?.checkedAt && moment(service.checkedAt).isValid() && (
              <span className="text-[11px] text-muted-foreground">
                {moment(service.checkedAt).fromNow()}
              </span>
            )}
          </div>
        ),
      },
      responseTime: {
        render: () => (
          <span className=" text-xs font-semibold px-2 py-0.5 rounded bg-muted/60 text-foreground inline-block">
            {service?.responseTimeMs != null
              ? `${service.responseTimeMs} ms`
              : "N/A"}
          </span>
        ),
      },
    };
  });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          {t("Service Monitoring Status", "सेवा निगरानी स्थिति")}
        </h3>
        <Badge variant="outline" className="text-xs">
          {services.length} {t("Services", "सेवाएं")}
        </Badge>
      </div>
      <MyTable
        tableHeaders={tableHeaders}
        tableBody={tableBody}
        emptyText={t(
          "No monitoring services available",
          "कोई निगरानी सेवा उपलब्ध नहीं",
        )}
        onRowClick={(rowIndex)=> {
            // console.log(services[rowIndex])
            setOpenDialog(services[rowIndex]);
        }}

      />

      {openDialog && (
        <EditDialog
          title={`${openDialog?.name || "Service"} - ${t("Recent History", "हाल का इतिहास")}`}
          onClose={() => setOpenDialog(null)}
          isHideFooter={true}
          bodyClassname="max-w-xl pb-5"
        >
          <div className="space-y-3">
            {Array.isArray(openDialog?.recentHistory) &&
            openDialog.recentHistory.length > 0 ? (
              <div className="space-y-2.5">
                {openDialog.recentHistory.map((h, idx) => {
                  const isUp =
                    h?.status?.toUpperCase() === "UP" ||
                    Boolean(h?.isUp) ||
                    (h?.statusCode && h.statusCode >= 200 && h.statusCode < 400);

                  return (
                    <div
                      key={h?._id || idx}
                      className={clsx(
                        "p-3.5 rounded-xl border transition-colors flex flex-col gap-2.5",
                        isUp
                          ? "bg-card border-border hover:border-emerald-500/30"
                          : "bg-destructive/5 border-destructive/20 hover:border-destructive/40",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={clsx(
                              "text-xs font-semibold px-2 py-0.5 inline-flex items-center gap-1.5",
                              isUp
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-destructive/10 text-destructive border-destructive/20",
                            )}
                          >
                            <span
                              className={clsx(
                                "w-1.5 h-1.5 rounded-full",
                                isUp ? "bg-emerald-500" : "bg-destructive",
                              )}
                            />
                            {h?.status || (isUp ? "UP" : "DOWN")}
                          </Badge>
                          {h?.statusCode && (
                            <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              HTTP {h.statusCode}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                          <span>
                            {h?.checkedAt && moment(h.checkedAt).isValid()
                              ? moment(h.checkedAt).format("DD MMM YYYY, hh:mm:ss A")
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1.5">
                          <span>
                            {t("Response Time:", "प्रतिक्रिया समय:")}
                          </span>
                          <span className="font-semibold text-foreground">
                            {h?.responseTimeMs != null
                              ? `${h.responseTimeMs} ms`
                              : "N/A"}
                          </span>
                        </span>
                        {h?.checkedAt && moment(h.checkedAt).isValid() && (
                          <span className="text-[11px] text-muted-foreground/80">
                            {moment(h.checkedAt).fromNow()}
                          </span>
                        )}
                      </div>

                      {h?.error && (
                        <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                          <span className="font-semibold">
                            {t("Error:", "त्रुटि:")}{" "}
                          </span>
                          {typeof h.error === "object"
                            ? JSON.stringify(h.error)
                            : String(h.error)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t(
                  "No recent history records found.",
                  "कोई हालिया इतिहास रिकॉर्ड नहीं मिला।",
                )}
              </div>
            )}
          </div>
        </EditDialog>
      )}
    </div>
  );
};

export default MonitoringStatus;


