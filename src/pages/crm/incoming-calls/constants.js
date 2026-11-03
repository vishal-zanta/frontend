export const getCallerComplaints = (t) => [
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
      "कॉल के माध्यम से शिकायत दर्ज की गई। घर के पास नाली ओवरफ्लो हो रही है। फील्ड विजिट किया गया - पाइप बदलना लंबित है。",
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
      "स्ट्रीट लाइट पोल की मरम्मत की गई। नागरिक समाधान से संतुष्ट है。",
    ),
  },
];

export const getDepartments = (t) => [
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

export const getRepeatCaller = (t) => ({
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
});

export const QUICK_CALLBACK_NUMBERS = [
  "+91 98350 44567 (Sunita Devi)",
  "+91 98350 11234 (Ramesh Prasad)",
  "+91 99730 88123 (Anjali Kumari)",
];

export const formatDuration = (seconds) =>
  `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;

export const getDispositionBadgeClass = (disposition = "") => {
  if (disposition.includes("Escalat")) {
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  }
  if (disposition.includes("Supervisor")) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
  return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
};

export const getAgentStatusBadgeClass = (status = "") => {
  if (status === "Available") {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  }
  if (status === "On Call") {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
  if (status === "Break") {
    return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  }
  return "bg-muted/50 text-muted-foreground border-border";
};

export const getAgentCardBorderClass = (status = "") => {
  if (status === "Available") {
    return "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20";
  }
  if (status === "On Call") {
    return "border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20";
  }
  if (status === "Break") {
    return "border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/20";
  }
  return "border-border bg-muted/40";
};
