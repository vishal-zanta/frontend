import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useGetShifts } from "../hooks";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";
import { useLanguage } from "@/context/LanguageContext";

export default function AgentStatusBoard({
  isSupervisor = false,
  setAgentView = () => {},
}) {
  const { t } = useLanguage();
  const pageProps = usePagination();
  const { data, isLoading, error } = useGetShifts({
    page: pageProps.page,
    limit: pageProps.limit,
  });

  const shiftsData = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages;

  const formatShift = (shift) => {
    if (!shift) return "-";
    let datePart = "";
    if (shift.date) {
      const d = new Date(shift.date);
      if (!isNaN(d.getTime())) {
        datePart = d.toLocaleDateString("en-IN");
      } else {
        datePart = shift.date;
      }
    }
    const timePart = shift.time || "";
    if (datePart && timePart) return `${datePart} | ${timePart}`;
    return datePart || timePart || "-";
  };

  useEffect(() => {
    if (data?.data?.data?.myShift) {
      setAgentView(data?.data?.data?.myShift);
    }
  }, [data?.data?.data?.myShift]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="font-bold text-foreground">
          {isSupervisor
            ? t("Agent Status Board", "एजेंट स्थिति बोर्ड")
            : t(
                "Agent Status Board (Read-Only)",
                "एजेंट स्थिति बोर्ड (केवल-पठन)",
              )}
        </h3>
      </div>
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">{t("Agent", "एजेंट")}</th>
                <th className="px-4 py-3 font-medium">{t("Role", "भूमिका")}</th>
                <th className="px-4 py-3 font-medium">{t("Shift", "शिफ्ट")}</th>
                <th className="px-4 py-3 font-medium">
                  {t("Calls Today", "आज की कॉल")}
                </th>
                {isSupervisor && (
                  <>
                    <th className="px-4 py-3 font-medium">
                      {t("Resolved", "हल की गई")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("Avg Talk Time", "औसत बात करने का समय")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("CSAT", "सीएसएटी")}
                    </th>
                  </>
                )}
                <th className="px-4 py-3 font-medium">
                  {t("Status", "स्थिति")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shiftsData.map((a) => (
                <tr key={a._id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      {a.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {a.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.role?.level || a.role?.designationEnglish}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatShift(a?.shift)}
                  </td>
                  <td className="px-4 py-3">{a?.callsToday || 0}</td>
                  {isSupervisor && (
                    <>
                      <td className="px-4 py-3">{a?.resolvedToday || 0}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a?.avgTalkTime || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-amber-600">
                          ★ {a?.csat || "-"}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        a?.status === "On Call"
                          ? "bg-amber-50 text-amber-700"
                          : a?.status === "Available"
                            ? "bg-emerald-50 text-emerald-700"
                            : a?.status === "Break"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {a?.status === "On Call"
                        ? t("On Call", "कॉल पर")
                        : a?.status === "Available"
                          ? t("Available", "उपलब्ध")
                          : a?.status === "Break"
                            ? t("Break", "ब्रेक")
                            : a?.status || "-"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LoaderErrWrapper>
      <Pagination {...pageProps} totalPage={totalPages} />
    </div>
  );
}
