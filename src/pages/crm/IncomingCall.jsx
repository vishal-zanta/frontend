import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  PhoneOff,
  User,
  Clock,
  AlertTriangle,
  Users,
  CheckCircle2,
  Building2,
  PhoneForwarded,
  Pause,
  Mic,
  MicOff,
  PhoneOutgoing,
  FileText,
  Circle,
  PhoneCall,
} from "lucide-react";
import { CRM_AGENTS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useLanguage } from "@/context/LanguageContext";

export default function IncomingCall() {
  const { t } = useLanguage();
  const [callState, setCallState] = useState("ringing"); // ringing -> connected -> rerouting -> ended
  const [callDuration, setCallDuration] = useState(0);
  const [rerouteTarget, setRerouteTarget] = useState(null); // { type: "agent"|"dept", id }
  const [showReroutePanel, setShowReroutePanel] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [showOutbound, setShowOutbound] = useState(false);
  const [outboundNumber, setOutboundNumber] = useState("");

  // Past complaints for the repeat caller
  const callerComplaints = [
    {
      id: "BH-2026-047824",
      service: t("Drainage & Sewerage", "जल निकासी और सीवरेज"),
      subservice: t("Drain overflow", "नाली ओवरफ्लो"),
      status: "In Progress",
      priority: "High",
      filedDate: "02 Jul 2026",
      ward: t("Patna Ward-07", "पटना वार्ड -07"),
      notes: t(
        "Complaint filed via call. Drain near house overflowing. Field visit done - pipe replacement pending.",
        "कॉल के माध्यम से शिकायत दर्ज की गई। घर के पास नाली ओवरफ्लो हो रही है। फील्ड विजिट किया गया - पाइप बदलना लंबित है।",
      ),
    },
    {
      id: "BH-2026-039102",
      service: t("Street Lighting", "स्ट्रीट लाइटिंग"),
      subservice: t(
        "Street light not working",
        "स्ट्रीट लाइट काम नहीं कर रही है",
      ),
      status: "Resolved",
      priority: "Normal",
      filedDate: "15 Jun 2026",
      ward: t("Patna Ward-07", "पटना वार्ड -07"),
      notes: t(
        "Street light pole repaired. Citizen satisfied with resolution.",
        "स्ट्रीट लाइट पोल की मरम्मत की गई। नागरिक समाधान से संतुष्ट है।",
      ),
    },
  ];

  const departments = [
    { id: "energy", name: t("Energy Dept", "ऊर्जा विभाग"), icon: "Lightbulb" },
    {
      id: "urban-dev",
      name: t("Urban Dev Dept", "नगर विकास विभाग"),
      icon: "Building2",
    },
    {
      id: "phed",
      name: t("PHED (Water)", "लोक स्वास्थ्य अभियंत्रण (जल)"),
      icon: "Waves",
    },
    { id: "rcd", name: t("Roads & RCD", "सड़क और आरसीडी"), icon: "Road" },
    { id: "forest", name: t("Forest (Animal)", "वन (पशु)"), icon: "PawPrint" },
    { id: "sanitation", name: t("Sanitation", "स्वच्छता"), icon: "Trash2" },
  ];

  const repeatCaller = {
    name: "Sunita Devi",
    mobile: "+91 98350 44567",
    district: t("Patna", "पटना"),
    ward: t("Patna Ward-07", "पटना वार्ड -07"),
    previousCalls: [
      {
        id: "CALL-2026-08214",
        time: "02 Jul, 10:15 AM",
        agent: "Priya Sharma",
        duration: "6m 30s",
        disposition: t("Complaint Registered", "शिकायत दर्ज की गई"),
        complaintId: "BH-2026-047824",
      },
      {
        id: "CALL-2026-08356",
        time: "03 Jul, 02:20 PM",
        agent: "Amit Verma",
        duration: "4m 10s",
        disposition: t("Status Update", "स्थिति अपडेट"),
        complaintId: "BH-2026-047824",
      },
      {
        id: "CALL-2026-08489",
        time: "04 Jul, 09:45 AM",
        agent: "Neha Singh",
        duration: "8m 25s",
        disposition: t("Escalation Request", "तीव्रता अनुरोध"),
        complaintId: "BH-2026-047824",
      },
      {
        id: "CALL-2026-08512",
        time: "05 Jul, 04:10 PM",
        agent: "Priya Sharma",
        duration: "5m 45s",
        disposition: t("Status Update", "स्थिति अपडेट"),
        complaintId: "BH-2026-047824",
      },
      {
        id: "CALL-2026-08588",
        time: "06 Jul, 08:30 AM",
        agent: "Rohit Kumar",
        duration: "7m 20s",
        disposition: t("Supervisor Request", "पर्यवेक्षक अनुरोध"),
        complaintId: "BH-2026-047824",
      },
    ],
  };

  useEffect(() => {
    if (callState === "connected") {
      const interval = setInterval(
        () => setCallDuration((prev) => prev + 1),
        1000,
      );
      return () => clearInterval(interval);
    }
  }, [callState]);

  const formatDuration = (s) =>
    `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;

  const acceptCall = () => setCallState("connected");
  const endCall = () => {
    setCallState("ended");
    setCallDuration(0);
  };

  const confirmReroute = () => {
    setCallState("rerouting");
    setTimeout(() => {
      setCallState("ended");
      setShowReroutePanel(false);
    }, 2000);
  };

  const availableAgents = CRM_AGENTS.filter(
    (a) => a.status === "Available" || a.status === "On Call",
  );

  return (
    <PortalLayout role="crm">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("Incoming Call - Agent Desktop", "आगमन कॉल - एजेंट डेस्कटॉप")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(
              "Live call handling with hold, mute, transfer, conference, recording, caller complaint history & outbound dial",
              "होल्ड, म्यूट, ट्रांसफर, कॉन्फ्रेंस, रिकॉर्डिंग, कॉलर शिकायत इतिहास और आउटबाउंड डायल के साथ लाइव कॉल हैंडलिंग",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Call panel */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-2xl p-6 text-white ${callState === "ringing" ? "bg-gradient-to-br from-amber-500 to-orange-600" : callState === "connected" ? "bg-gradient-to-br from-blue-900 to-blue-600" : callState === "rerouting" ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-gradient-to-br from-slate-500 to-slate-700"}`}
            >
              {/* Caller info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-lg font-bold">{repeatCaller.name}</div>
                  <div className="text-sm text-white/80">
                    {repeatCaller.mobile}
                  </div>
                </div>
              </div>

              {/* Recording indicator */}
              {callState === "connected" && isRecording && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1.5 bg-red-500/90 px-2.5 py-1 rounded-full text-xs font-medium">
                    <Circle className="w-2.5 h-2.5 fill-white animate-pulse" />{" "}
                    REC
                  </div>
                  <span className="text-xs text-white/70">
                    {t(
                      "Call recording in progress",
                      "कॉल रिकॉर्डिंग प्रगति पर है",
                    )}
                  </span>
                  <button
                    onClick={() => setIsRecording(false)}
                    className="ml-auto text-xs text-white/60 hover:text-white underline"
                  >
                    {t("Stop", "रोकें")}
                  </button>
                </div>
              )}

              {/* Repeat caller alert */}
              <div className="bg-white/10 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold">
                    {t("Repeat Caller", "पुनरावृत्ति कॉलर")} -{" "}
                    {repeatCaller.previousCalls.length}{" "}
                    {t("previous calls", "पिछली कॉल")}
                  </div>
                  <div className="text-white/70 text-xs">
                    {t("Citizen has called", "नागरिक ने कॉल किया है")}{" "}
                    {repeatCaller.previousCalls.length}{" "}
                    {t("times about the same issue", "बार इसी मुद्दे पर")}
                  </div>
                </div>
              </div>

              {/* Call state */}
              <div className="text-center mb-6">
                {callState === "ringing" && (
                  <>
                    <div className="flex justify-center mb-3">
                      <Phone className="w-10 h-10 animate-bounce" />
                    </div>
                    <div className="text-lg font-semibold">
                      {t("Incoming Call...", "आगमन कॉल...")}
                    </div>
                    <div className="text-sm text-white/70">
                      {t("Call from", "कॉल से")} {repeatCaller.district},{" "}
                      {repeatCaller.ward}
                    </div>
                  </>
                )}
                {callState === "connected" && (
                  <>
                    <div className="flex justify-center mb-3">
                      <Phone className="w-8 h-8" />
                    </div>
                    <div className="text-lg font-semibold font-mono">
                      {formatDuration(callDuration)}
                    </div>
                    <div className="text-sm text-white/70">
                      {isHold
                        ? t("On Hold", "होल्ड पर")
                        : isMuted
                          ? t("Muted", "म्यूट")
                          : t("Connected", "जुड़ा हुआ")}
                    </div>
                  </>
                )}
                {callState === "rerouting" && (
                  <>
                    <div className="flex justify-center mb-3">
                      <PhoneForwarded className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="text-lg font-semibold">
                      {t(
                        "Rerouting call...",
                        "कॉल पुनः निर्देशित किया जा रहा है...",
                      )}
                    </div>
                    <div className="text-sm text-white/70">
                      {t("Transferring to", "स्थानांतरित किया जा रहा है")}{" "}
                      {rerouteTarget?.name}
                    </div>
                  </>
                )}
                {callState === "ended" && (
                  <>
                    <div className="flex justify-center mb-3">
                      <PhoneOff className="w-8 h-8" />
                    </div>
                    <div className="text-lg font-semibold">
                      {t("Call Ended", "कॉल समाप्त")}
                    </div>
                    <div className="text-sm text-white/70">
                      {rerouteTarget
                        ? `${t("Transferred to", "स्थानांतरित किया गया")} ${rerouteTarget.name}`
                        : t("Completed", "पूरा हुआ")}
                    </div>
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-2 justify-center">
                {callState === "ringing" && (
                  <Button
                    onClick={acceptCall}
                    className="bg-card text-emerald-600 hover:bg-white/90"
                  >
                    <Phone className="w-4 h-4 mr-1" />{" "}
                    {t("Accept", "स्वीकार करें")}
                  </Button>
                )}
                {callState === "connected" && (
                  <div className="space-y-2">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => setIsHold(!isHold)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isHold ? "bg-amber-400 text-white" : "bg-white/20 hover:bg-white/30 text-white"}`}
                        title={t("Hold", "होल्ड")}
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"}`}
                        title={t("Mute", "म्यूट")}
                      >
                        {isMuted ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setShowReroutePanel(!showReroutePanel)}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                        title={t(
                          "Transfer / Conference",
                          "स्थानांतरण / सम्मेलन",
                        )}
                      >
                        <PhoneForwarded className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowOutbound(!showOutbound)}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                        title={t("Outbound Dial", "आउटबाउंड डायल")}
                      >
                        <PhoneOutgoing className="w-4 h-4" />
                      </button>
                      <button
                        onClick={endCall}
                        className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
                        title={t("End Call", "कॉल समाप्त करें")}
                      >
                        <PhoneOff className="w-4 h-4" />
                      </button>
                    </div>
                    <Link to="/crm/raise" className="block">
                      <Button className="w-full bg-card text-primary hover:bg-white/90">
                        <FileText className="w-4 h-4 mr-1" />{" "}
                        {t("Raise Complaint", "शिकायत दर्ज करें")}
                      </Button>
                    </Link>
                  </div>
                )}
                {(callState === "ended" || callState === "rerouting") && (
                  <Button
                    onClick={() => {
                      setCallState("ringing");
                      setRerouteTarget(null);
                      setCallDuration(0);
                    }}
                    className="bg-card text-primary hover:bg-white/90"
                  >
                    <Phone className="w-4 h-4 mr-1" />{" "}
                    {t("Simulate New Call", "नया कॉल अनुकरण करें")}
                  </Button>
                )}
              </div>
            </div>

            {/* Quick info */}
            <div className="bg-card rounded-xl border border-border p-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("District", "जिला")}:
                </span>
                <span className="font-medium">{repeatCaller.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("Ward", "वार्ड")}:
                </span>
                <span className="font-medium">{repeatCaller.ward}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("Previous Calls", "पिछली कॉल")}:
                </span>
                <span className="font-medium text-amber-600">
                  {repeatCaller.previousCalls.length} {t("times", "बार")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("Last Call", "आखरी कॉल")}:
                </span>
                <span className="font-medium">
                  {repeatCaller.previousCalls[0]?.time}
                </span>
              </div>
            </div>
          </div>

          {/* Call history + reroute */}
          <div className="lg:col-span-2 space-y-6">
            {/* Previous calls history */}
            <div className="bg-card rounded-xl border border-border">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-bold text-foreground">
                  {t(
                    "Caller History - Previous Interactions",
                    "कॉलर इतिहास - पिछला संवाद",
                  )}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">
                        {t("Call ID", "कॉल आईडी")}
                      </th>
                      <th className="px-4 py-2 font-medium">
                        {t("Date / Time", "दिनांक / समय")}
                      </th>
                      <th className="px-4 py-2 font-medium">
                        {t("Agent", "एजेंट")}
                      </th>
                      <th className="px-4 py-2 font-medium">
                        {t("Duration", "अवधि")}
                      </th>
                      <th className="px-4 py-2 font-medium">
                        {t("Disposition", "निपटान")}
                      </th>
                      <th className="px-4 py-2 font-medium">
                        {t("Complaint", "शिकायत")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {repeatCaller.previousCalls.map((c, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-mono text-xs text-primary">
                          {c.id}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {c.time}
                        </td>
                        <td className="px-4 py-2.5">{c.agent}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {c.duration}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            variant="outline"
                            className={`text-xs ${c.disposition.includes("Escalat") ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" : c.disposition.includes("Supervisor") ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"}`}
                          >
                            {c.disposition}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          <ComplaintId id={c.complaintId} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Past complaint history */}
            <div className="bg-card rounded-xl border border-border">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-bold text-foreground">
                  {t("Caller's Complaint History", "कॉलर का शिकायत इतिहास")}
                </h3>
                <Badge variant="outline" className="text-[10px] ml-auto">
                  {callerComplaints.length} {t("complaints", "शिकायतें")}
                </Badge>
              </div>
              <div className="divide-y divide-border">
                {callerComplaints.map((c, i) => (
                  <div
                    key={i}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ComplaintId
                        id={c.id}
                        className="text-xs font-semibold"
                      />
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                      <span className="text-xs text-muted-foreground ml-auto">
                        {c.filedDate}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {c.service} → {c.subservice}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {c.ward}
                    </div>
                    <div className="mt-2 bg-muted/50 rounded-lg p-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {t("Notes:", "टिप्पणी:")}{" "}
                      </span>
                      {c.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbound dial panel */}
            {showOutbound && callState === "connected" && (
              <div className="bg-card rounded-xl border-2 border-primary p-5">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <PhoneOutgoing className="w-5 h-5 text-primary" />{" "}
                  {t("Outbound Dial", "आउटबाउंड डायल")}
                </h3>
                <div className="flex gap-2">
                  <Input
                    value={outboundNumber}
                    onChange={(e) => setOutboundNumber(e.target.value)}
                    placeholder={t(
                      "Enter phone number to dial...",
                      "डायल करने के लिए फोन नंबर दर्ज करें...",
                    )}
                    className="flex-1 bg-white"
                  />
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    disabled={!outboundNumber}
                  >
                    <PhoneCall className="w-4 h-4 mr-1" /> {t("Dial", "डायल")}
                  </Button>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-2">
                    {t(
                      "Quick Callback - Recent Citizen Numbers:",
                      "त्वरित कॉलबैक - हाल के नागरिक नंबर:",
                    )}
                  </div>
                  <div className="space-y-1">
                    {[
                      "+91 98350 44567 (Sunita Devi)",
                      "+91 98350 11234 (Ramesh Prasad)",
                      "+91 99730 88123 (Anjali Kumari)",
                    ].map((num, i) => (
                      <button
                        key={i}
                        onClick={() => setOutboundNumber(num.split(" (")[0])}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all bg-white"
                      >
                        <PhoneOutgoing className="w-3.5 h-3.5 inline mr-2 text-muted-foreground" />{" "}
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reroute panel */}
            {showReroutePanel && callState === "connected" && (
              <div className="bg-card rounded-xl border-2 border-primary p-5">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <PhoneForwarded className="w-5 h-5 text-primary" />{" "}
                  {t("Reroute Call", "कॉल पुनः निर्देशित करें")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reroute to department */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                      {t("Transfer to Department", "विभाग को ट्रांसफर करें")}
                    </h4>
                    <div className="space-y-2">
                      {departments.map((dept) => (
                        <button
                          key={dept.id}
                          onClick={() =>
                            setRerouteTarget({
                              type: "dept",
                              id: dept.id,
                              name: dept.name,
                            })
                          }
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left bg-white ${rerouteTarget?.id === dept.id ? "border-primary bg-blue-50" : "border-border hover:bg-muted/50"}`}
                        >
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {dept.name}
                          </span>
                          {rerouteTarget?.id === dept.id && (
                            <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reroute to agent */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                      {t("Transfer to Agent", "एजेंट को ट्रांसफर करें")}
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                      {availableAgents.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() =>
                            setRerouteTarget({
                              type: "agent",
                              id: agent.id,
                              name: agent.name,
                            })
                          }
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left bg-white ${rerouteTarget?.id === agent.id ? "border-primary bg-blue-50" : "border-border hover:bg-muted/50"}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            {agent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {agent.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {agent.role} - {agent.shift.split("(")[0]}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${agent.status === "Available" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"}`}
                          >
                            {agent.status}
                          </Badge>
                          {rerouteTarget?.id === agent.id && (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {rerouteTarget && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setRerouteTarget(null)}
                    >
                      {t("Cancel", "रद्द करें")}
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={confirmReroute}
                    >
                      <PhoneForwarded className="w-4 h-4 mr-1" />{" "}
                      {t("Transfer to", "ट्रांसफर करें")} {rerouteTarget.name}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Agent board */}
            <div className="bg-card rounded-xl border border-border">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-bold text-foreground">
                  {t("Agent Board - Live Status", "एजेंट बोर्ड - लाइव स्थिति")}
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                {CRM_AGENTS.map((agent) => (
                  <div
                    key={agent.id}
                    className={`rounded-xl border p-3 ${agent.status === "Available" ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20" : agent.status === "On Call" ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20" : agent.status === "Break" ? "border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/20" : "border-border bg-muted/40"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                        {agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {agent.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {agent.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${agent.status === "Available" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : agent.status === "On Call" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : agent.status === "Break" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" : "bg-muted/50 text-muted-foreground border-border"}`}
                      >
                        {agent.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {agent.callsToday} {t("calls", "कॉल")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
