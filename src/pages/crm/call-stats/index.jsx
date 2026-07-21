import PortalLayout from "@/components/PortalLayout";
import React from "react";
import LayoutHeading from "@/components/LayoutHeading";
import MyTable from "@/components/MyTable";
import { LoginPhoneCell, MonitorCell, SpendingTimeCell } from "./components/CustomTableCells";
import { useLanguage } from "@/context/LanguageContext";

const callStatsData = {
  tableHeaders: [
    {
      id: "agentReady",
      label: "Agent Ready",
      labelHindi: "तैयार एजेंट",
    },
    {
      id: "agentInCall",
      label: "Agent In Call",
      labelHindi: "कॉल पर एजेंट",
    },
    {
      id: "agentBreak",
      label: "Agent In Break",
      labelHindi: "ब्रेक पर एजेंट",
    },
    {
      id: "otherAgents",
      label: "Other Agents",
      labelHindi: "अन्य एजेंट",
    },
    {
      id: "totalAgents",
      label: "Total Agents",
      labelHindi: "कुल एजेंट",
    },
    {
      id: "callsInQueue",
      label: "Calls In Queue",
      labelHindi: "कतार में कॉल",
    },
    {
      id: "missedCalls",
      label: "Missed Calls",
      labelHindi: "छूटी हुई कॉल",
    },
    {
      id: "callsAbandoned",
      label: "Calls Abandoned",
      labelHindi: "छोड़ी गई कॉल",
    },
    {
      id: "totalInBoundCalls",
      label: "Total Inbound Calls",
      labelHindi: "कुल इनबाउंड कॉल",
    },
    {
      id: "totalOutBoundCalls",
      label: "Total Outbound Calls",
      labelHindi: "कुल आउटबाउंड कॉल",
    },
    {
      id: "longCalls",
      label: "Long Calls",
      labelHindi: "लंबी कॉल",
    },
    {
      id: "shortCalls",
      label: "Short Calls",
      labelHindi: "छोटी कॉल",
    },
  ],
  tableBody: [
    {
      agentReady: { value: "63" },
      agentInCall: { value: "55" },
      agentBreak: { value: "23" },
      otherAgents: { value: "87" },
      totalAgents: { value: "87" },
      callsInQueue: { value: "87" },
      missedCalls: { value: "1" },
      callsAbandoned: { value: "0" },
      totalInBoundCalls: { value: "4333" },
      totalOutBoundCalls: { value: "3336" },
      longCalls: { value: "00:18:23" },
      shortCalls: { value: "00:00:05" },
    },
  ],
};

const agentLiveData = {
  tableHeaders: [
    { id: "sNo", label: "S No", labelHindi: "क्र.सं." },
    { id: "agent", label: "Agent", labelHindi: "एजेंट" },
    { id: "userName", label: "User Name", labelHindi: "उपयोगकर्ता का नाम" },
    { id: "loginPhone", label: "Login Phone", labelHindi: "लॉगिन फोन" },
    { id: "customerPhone", label: "Customer Phone Number", labelHindi: "ग्राहक का फोन नंबर" },
    { id: "spendingTime", label: "Spending Time", labelHindi: "व्यतीत समय" },
    { id: "campaign", label: "Campaign", labelHindi: "अभियान" },
    { id: "skillGroup", label: "Skill Group", labelHindi: "कौशल समूह" },
    { id: "status", label: "Status", labelHindi: "स्थिति" },
    { id: "breakCode", label: "Break Code", labelHindi: "ब्रेक कोड" },
    { id: "outbound", label: "Outbound", labelHindi: "आउटबाउंड" },
    { id: "inbound", label: "Inbound", labelHindi: "इनबाउंड" },
    { id: "maxDispoTime", label: "Max Dispo Time", labelHindi: "अधिकतम डिस्पो समय" },
    { id: "totalBreakTime", label: "Total Break Time", labelHindi: "कुल ब्रेक समय" },
    { id: "monitor", label: "Monitor", labelHindi: "निगरानी", className: "text-center" },
  ],
  tableBody: [
    {
      sNo: { value: "1" },
      agent: { value: "201231" },
      userName: { value: "Ankit kumar" },
      loginPhone: {
        render: () => <LoginPhoneCell data={{ value: "103" }} />,
        className: "px-0 py-0 bg-red-200",
      },
      customerPhone: { value: "8434628247" },
      spendingTime: {
        value: "00:01:22",
        render: () => <SpendingTimeCell data={{ value: "00:02:56" }} />,
        className:
          " px-0 py-0 text-xs font-semibold  bg-emerald-100  font-mono",
      },
      campaign: { value: "Inbound" },
      skillGroup: {
        value: "EMGY,MBC_PRIORITY,SPR",
      },
      status: {
        value: "INCALL",
      },
      breakCode: { value: "-" },
      outbound: { value: "0" },
      inbound: { value: "4" },
      maxDispoTime: { value: "00:00:17" },
      totalBreakTime: { value: "00:00:09" },
      monitor: {
        render: () => (
         <MonitorCell/>
        ),
      },
    },
  ],
};

const CallStats = () => {
  const { t } = useLanguage();

  const callStatsHeaders = callStatsData.tableHeaders.map((h) => ({
    ...h,
    label: t(h.label, h.labelHindi),
  }));

  const agentLiveHeaders = agentLiveData.tableHeaders.map((h) => ({
    ...h,
    label: t(h.label, h.labelHindi),
  }));

  return (
    <PortalLayout>
      <div className="p-6 space-y-6">
        <LayoutHeading title={t("Call Statistics", "कॉल सांख्यिकी")} />
        <MyTable
          tableHeaders={callStatsHeaders}
          tableBody={callStatsData.tableBody}
          tableClassName="rounded-xl border border-border bg-white"
        />
        <LayoutHeading title={t("Agent Live Statistics", "एजेंट लाइव सांख्यिकी")} />
        <MyTable
          tableHeaders={agentLiveHeaders}
          tableBody={agentLiveData.tableBody}
          tableClassName="rounded-xl border border-border bg-white"
        />
      </div>
    </PortalLayout>
  );
};

export default CallStats;
