import PortalLayout from "@/components/PortalLayout";
import React from "react";
import LayoutHeading from "@/components/LayoutHeading";
import MyTable from "@/components/MyTable";
import { LoginPhoneCell, MonitorCell, SpendingTimeCell } from "./components/CustomTableCells";
const callStatsData = {
  tableHeaders: [
    {
      id: "agentReady",
      label: "Agent Ready",
    },
    {
      id: "agentInCall",
      label: "Agent In Call",
    },
    {
      id: "agentBreak",
      label: "Agent In Break",
    },
    {
      id: "otherAgents",
      label: "Other Agents",
    },
    {
      id: "totalAgents",
      label: "Total Agents",
    },
    {
      id: "callsInQueue",
      label: "Calls In Queue",
    },
    {
      id: "missedCalls",
      label: "Missed Calls",
    },
    {
      id: "callsAbandoned",
      label: "Calls Abandoned",
    },
    {
      id: "totalInBoundCalls",
      label: "Total Inbound Calls",
    },
    {
      id: "totalOutBoundCalls",
      label: "Total Outbound Calls",
    },
    {
      id: "longCalls",
      label: "Long Calls",
    },
    {
      id: "shortCalls",
      label: "Short Calls",
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
    { id: "sNo", label: "S No" },
    { id: "agent", label: "Agent" },
    { id: "userName", label: "User Name" },
    { id: "loginPhone", label: "Login Phone" },
    { id: "customerPhone", label: "Customer Phone Number" },
    { id: "spendingTime", label: "Spending Time" },
    { id: "campaign", label: "Campaign" },
    { id: "skillGroup", label: "Skill Group" },
    { id: "status", label: "Status" },
    { id: "breakCode", label: "Break Code" },
    { id: "outbound", label: "Outbound" },
    { id: "inbound", label: "Inbound" },
    { id: "maxDispoTime", label: "Max Dispo Time" },
    { id: "totalBreakTime", label: "Total Break Time" },
    { id: "monitor", label: "Monitor" ,className: "text-center"},
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
  return (
    <PortalLayout>
      <div className="p-6 space-y-6">
        <LayoutHeading title={"Call Statistics"} />
        <MyTable
          tableHeaders={callStatsData.tableHeaders}
          tableBody={callStatsData.tableBody}
        />
        <LayoutHeading title={"Agent Live Statistics"} />
        <MyTable
          tableHeaders={agentLiveData.tableHeaders}
          tableBody={agentLiveData.tableBody}
        />
      </div>
    </PortalLayout>
  );
};

export default CallStats;
