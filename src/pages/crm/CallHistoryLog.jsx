import React, { useState } from "react";
import {
  Clock,
  PhoneCall,
  PhoneMissed,
  Search,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { CALL_TRACKER } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import StatCard from "@/components/StatCard";
import { CallId, ComplaintId } from "@/components/ComplaintDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportButton from "@/components/ExportButton";
import { useLanguage } from "@/context/LanguageContext";

// Extend call tracker with recording metadata and evidence tags
const callHistoryLog = CALL_TRACKER.map((c, i) => ({
  ...c,
  recordingUrl: `rec:// recordings/${c.id}.mp3`,
  recordingDuration: c.duration,
  evidenceTagged: i % 4 === 0, // every 4th call is evidence-tagged
  evidenceReason: i % 4 === 0 ? "Legal escalation - dispute case" : null,
  taggedBy: i % 4 === 0 ? "Supervisor: Amit Verma" : null,
  taggedDate: i % 4 === 0 ? "06 Jul 2026" : null,
  citizenMobile: `+91 9835${String(100000 + i * 137).slice(0, 6)}`,
  callType: i % 3 === 0 ? "Outbound" : "Inbound",
}));

export default function CallHistoryLog() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [evidenceOnly, setEvidenceOnly] = useState(false);
  const [selected, setSelected] = useState([]);
  const [tagDialog, setTagDialog] = useState(null);

  const exportColumns = [
    { key: "id", label: t("Call ID", "कॉल आईडी") },
    { key: "callType", label: t("Type", "प्रकार") },
    { key: "time", label: t("Date/Time", "दिनांक/समय") },
    { key: "citizenMobile", label: t("Citizen Mobile", "नागरिक मोबाइल") },
    { key: "agent", label: t("Agent", "एजेंट") },
    { key: "duration", label: t("Duration", "अवधि") },
    { key: "complaintId", label: t("Complaint ID", "शिकायत आईडी") },
    { key: "disposition", label: t("Disposition", "निपटान") },
    { key: "status", label: t("Status", "स्थिति") },
    {
      key: (r) =>
        r.evidenceTagged
          ? t("Yes", "हाँ") + " - " + (r.evidenceReason || "")
          : t("No", "नहीं"),
      label: t("Evidence Tagged", "साक्ष्य चिह्नित"),
    },
  ];

  const filtered = callHistoryLog.filter((c) => {
    if (
      search &&
      !c.id.toLowerCase().includes(search.toLowerCase()) &&
      !(c.complaintId || "").toLowerCase().includes(search.toLowerCase()) &&
      !c.citizenMobile.includes(search)
    )
      return false;
    if (agentFilter !== "all" && !c.agent.toLowerCase().includes(agentFilter))
      return false;
    if (statusFilter !== "all" && c.status.toLowerCase() !== statusFilter)
      return false;
    if (evidenceOnly && !c.evidenceTagged) return false;
    return true;
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((c) => c.id));
  };

  const handleTagEvidence = () => {
    setTagDialog(null);
  };

  const evidenceCount = callHistoryLog.filter((c) => c.evidenceTagged).length;

  return (
    <PortalLayout role="crm">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("Call History Log", "कॉल इतिहास लॉग")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "Complete call archive with recording metadata, bulk export, and evidence-tagging for legal/audit purposes.",
                "रिकॉर्डिंग मेटाडेटा, थोक निर्यात और कानूनी/लेखापरीक्षा उद्देश्यों के लिए साक्ष्य-टैगिंग के साथ पूर्ण कॉल संग्रह।",
              )}
            </p>
          </div>
          <ExportButton
            data={filtered}
            columns={exportColumns}
            filename="call_history_log"
            label={t("Export", "निर्यात")}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={PhoneCall}
            label={t("Total Calls Logged", "कुल दर्ज कॉल")}
            value={callHistoryLog.length}
            color="blue"
          />
          <StatCard
            icon={ShieldCheck}
            label={t("Evidence Tagged", "साक्ष्य चिह्नित")}
            value={evidenceCount}
            color="purple"
          />
          <StatCard
            icon={PhoneMissed}
            label={t("Missed / Dropped", "छूटी हुई / गिरी हुई")}
            value={callHistoryLog.filter((c) => c.status === "Missed").length}
            color="red"
          />
          <StatCard
            icon={Clock}
            label={t("Avg Duration", "औसत अवधि")}
            value="4m 32s"
            color="amber"
          />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "Search by call ID, complaint, or mobile...",
                "कॉल आईडी, शिकायत या मोबाइल द्वारा खोजें...",
              )}
              className="pl-8 max-w-xs"
            />
          </div>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder={t("Agent", "एजेंट")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Agents", "सभी एजेंट")}
              </SelectItem>
              <SelectItem value="priya">Priya Sharma</SelectItem>
              <SelectItem value="amit">Amit Verma</SelectItem>
              <SelectItem value="neha">Neha Singh</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-background">
              <SelectValue placeholder={t("Status", "स्थिति")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Status", "सभी स्थिति")}
              </SelectItem>
              <SelectItem value="resolved">
                {t("Resolved", "हल की गई")}
              </SelectItem>
              <SelectItem value="missed">{t("Missed", "छूटी हुई")}</SelectItem>
              <SelectItem value="escalated">
                {t("Escalated", "बढ़ाया गया")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={evidenceOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setEvidenceOnly(!evidenceOnly)}
            className="ml-auto"
          >
            <ShieldCheck className="w-4 h-4 mr-1" />{" "}
            {evidenceOnly
              ? t("Showing Evidence Only", "केवल साक्ष्य दिखा रहा है")
              : t("Show Evidence Only", "केवल साक्ष्य दिखाएं")}
          </Button>
          {selected.length > 0 && (
            <Button
              size="sm"
              onClick={() => setTagDialog({ ids: selected })}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Tag className="w-4 h-4 mr-1" /> {t("Tag", "चिह्नित करें")}{" "}
              {selected.length} {t("as Evidence", "साक्ष्य के रूप में")}
            </Button>
          )}
        </div>

        {/* Call history table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-3 font-medium">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={toggleAll}
                      className="rounded cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Call ID", "कॉल आईडी")}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Type", "प्रकार")}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Date / Time", "दिनांक / समय")}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Citizen Mobile", "नागरिक मोबाइल")}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Agent", "एजेंट")}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Duration", "अवधि")}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Complaint", "शिकायत")}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Status", "स्थिति")}
                  </th>
                  <th className="px-3 py-3 font-medium">
                    {t("Evidence", "साक्ष्य")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-muted/30 ${selected.includes(c.id) ? "bg-purple-50/40 dark:bg-purple-950/20" : ""}`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <CallId id={c.id} />
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${c.callType === "Outbound" ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" : "bg-primary/10 text-primary"}`}
                      >
                        {c.callType === "Outbound"
                          ? t("Outbound", "आउटबाउंड")
                          : t("Inbound", "इनबाउंड")}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {c.time}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">
                      {c.citizenMobile}
                    </td>
                    <td className="px-3 py-3">{c.agent}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {c.duration}
                    </td>
                    <td className="px-3 py-3">
                      {c.complaintId ? <ComplaintId id={c.complaintId} /> : "-"}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${c.status === "Resolved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : c.status === "Missed" ? "bg-destructive/10 text-destructive" : c.status === "Escalated" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-muted/50 text-muted-foreground"}`}
                      >
                        {c.status === "Resolved"
                          ? t("Resolved", "हल की गई")
                          : c.status === "Missed"
                            ? t("Missed", "छूटी हुई")
                            : c.status === "Escalated"
                              ? t("Escalated", "बढ़ाया गया")
                              : c.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      {c.evidenceTagged ? (
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            {t("Tagged", "चिह्नित")}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setTagDialog({ ids: [c.id] })}
                          className="text-xs text-muted-foreground hover:text-primary underline cursor-pointer"
                        >
                          {t("Tag", "चिह्नित")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {t(
                "No calls match your filters.",
                "आपके फ़िल्टर से कोई कॉल मेल नहीं खाती।",
              )}
            </div>
          )}
        </div>

        {/* Bulk actions bar */}
        <div className="bg-muted/50 rounded-xl border border-border p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selected.length > 0
              ? `${selected.length} ${t("call(s) selected", "कॉल चयनित")}`
              : t(
                  "Click checkboxes to select calls for bulk actions",
                  "थोक कार्यों के लिए कॉल चुनने के लिए चेकबॉक्स पर क्लिक करें",
                )}
          </div>
          <div className="flex gap-2">
            <ExportButton
              data={
                selected.length > 0
                  ? filtered.filter((c) => selected.includes(c.id))
                  : filtered
              }
              columns={exportColumns}
              filename={
                selected.length > 0
                  ? "call_history_selected"
                  : "call_history_all"
              }
              label={t("Export", "निर्यात")}
            />
          </div>
        </div>
      </div>

      {/* Evidence tag dialog */}
      {tagDialog && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setTagDialog(null)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-foreground">
                {t("Tag", "चिह्नित करें")} {tagDialog.ids.length}{" "}
                {t("Call(s) as Evidence", "कॉल साक्ष्य के रूप में")}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-sm text-purple-600 dark:text-purple-400">
                {t(
                  "Evidence-tagged calls are preserved with enhanced retention (7 years) and flagged for legal/audit review. Recordings cannot be deleted while tagged.",
                  "साक्ष्य-चिह्नित कॉल को बढ़ी हुई अवधारण (7 वर्ष) के साथ संरक्षित किया जाता है और कानूनी/लेखापरीक्षा समीक्षा के लिए चिह्नित किया जाता है। चिह्नित होने के दौरान रिकॉर्डिंग हटाई नहीं जा सकती।",
                )}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  {t("Tagging Reason", "टैगिंग का कारण")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Legal escalation, dispute case, citizen complaint against agent..."
                  className="bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  {t("Case Reference (optional)", "मामला संदर्भ (वैकल्पिक)")}
                </label>
                <Input
                  placeholder="e.g., LEGAL-2026-00472"
                  className="bg-background"
                />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setTagDialog(null)}>
                {t("Cancel", "रद्द करें")}
              </Button>
              <Button
                onClick={handleTagEvidence}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <ShieldCheck className="w-4 h-4 mr-1" />{" "}
                {t("Confirm Evidence Tag", "साक्ष्य टैग की पुष्टि करें")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
