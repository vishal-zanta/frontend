import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useCall } from "@/context/CallContext";
import { CRM_AGENTS } from "@/lib/biharData";

import {
  getCallerComplaints,
  getDepartments,
  getRepeatCaller,
} from "./constants";
import CallCardWrapper from "./components/CallCardWrapper";
import CallerQuickInfo from "./components/CallerQuickInfo";
import CallerHistoryTable from "./components/CallerHistoryTable";
import CallerComplaintHistory from "./components/CallerComplaintHistory";
import OutboundDialPanel from "./components/OutboundDialPanel";
import ReroutePanel from "./components/ReroutePanel";
import AgentLiveBoard from "./components/AgentLiveBoard";

export default function IncomingCall() {
  const { t } = useLanguage();
  const location = useLocation();

  const {
    caller: contextCaller,
    activeCall,
    callState,
    stopRingtone,
  } = useCall();

  const [rerouteTarget, setRerouteTarget] = useState(null); // { type: "agent"|"dept", id, name }
  const [showReroutePanel, setShowReroutePanel] = useState(false);
  const [showOutbound, setShowOutbound] = useState(false);
  const [outboundNumber, setOutboundNumber] = useState("");

  // Stop ringtone when entering desktop screen
  useEffect(() => {
    stopRingtone?.();
  }, [stopRingtone]);

  const callData = activeCall || location.state;

  const callerComplaints = useMemo(() => {
    const grievances = callData?.screenPop?.recentGrievances;
    if (Array.isArray(grievances) && grievances.length > 0) {
      return grievances.map((g, idx) => ({
        id: g.grievanceId || `BH-2026-0${idx + 1}`,
        service: g.service || t("Public Grievance", "जन शिकायत"),
        subservice: g.subservice || t("General", "सामान्य"),
        status: g.status || "OPEN",
        priority: g.priority || "NORMAL",
        filedDate: g.filedDate || "Recently",
        ward: g.ward || t("Patna", "पटना"),
        notes: g.notes || "",
      }));
    }
    return getCallerComplaints(t);
  }, [t, callData]);

  const departments = useMemo(() => getDepartments(t), [t]);

  const repeatCaller = useMemo(() => {
    const base = getRepeatCaller(t);
    if (!contextCaller && !callData) return base;
    return {
      ...base,
      name:
        contextCaller?.name ||
        callData?.screenPop?.citizen?.fullName ||
        callData?.callerName ||
        callData?.callerId ||
        base.name,
      mobile:
        contextCaller?.mobile ||
        callData?.screenPop?.callerMobile ||
        callData?.screenPop?.citizen?.mobile ||
        callData?.callerId ||
        base.mobile,
      callId: contextCaller?.callId || callData?.callId,
    };
  }, [t, contextCaller, callData]);

  const confirmReroute = () => {
    setTimeout(() => {
      setShowReroutePanel(false);
    }, 2000);
  };

  const handleSimulateNewCall = () => {
    setRerouteTarget(null);
  };

  const availableAgents = useMemo(
    () =>
      CRM_AGENTS.filter(
        (a) => a.status === "Available" || a.status === "On Call",
      ),
    [],
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("Incoming Call - Agent Desktop", "प्राप्त कॉल - एजेंट डेस्कटॉप")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t(
            "Live call handling with hold, mute, transfer, conference, recording, caller complaint history & outbound dial",
            "होल्ड, म्यूट, ट्रांसफर, कॉन्फ्रेंस, रिकॉर्डिंग, कॉलर शिकायत इतिहास और आउटबाउंड डायल के साथ लाइव कॉल हैंडलिंग",
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Call panel & Quick info */}
        <div className="lg:col-span-1">
          <CallCardWrapper
            variant="full"
            showReroutePanel={showReroutePanel}
            setShowReroutePanel={setShowReroutePanel}
            showOutbound={showOutbound}
            setShowOutbound={setShowOutbound}
            rerouteTarget={rerouteTarget}
            onSimulateNewCall={handleSimulateNewCall}
          />

          <CallerQuickInfo caller={repeatCaller} />
        </div>

        {/* Right Column: Call history, Complaints, Dial & Transfer panels, Agent board */}
        <div className="lg:col-span-2 space-y-6">
          <CallerHistoryTable calls={repeatCaller.previousCalls} />

          <CallerComplaintHistory complaints={callerComplaints} />

          {showOutbound && callState === "connected" && (
            <OutboundDialPanel
              outboundNumber={outboundNumber}
              setOutboundNumber={setOutboundNumber}
            />
          )}

          {showReroutePanel && callState === "connected" && (
            <ReroutePanel
              departments={departments}
              availableAgents={availableAgents}
              rerouteTarget={rerouteTarget}
              setRerouteTarget={setRerouteTarget}
              onConfirm={confirmReroute}
              onCancel={() => setRerouteTarget(null)}
            />
          )}

          <AgentLiveBoard agents={CRM_AGENTS} />
        </div>
      </div>
    </div>
  );
}
