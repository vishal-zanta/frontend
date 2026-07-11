import React, { useState, useEffect } from "react";
import {
  Search,
  Printer,
  MapPin,
  User,
  Phone,
  Building2,
  Tag,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { COMPLAINTS } from "@/lib/biharData";
import { findComplaintById, getCitizenComplaints } from "@/lib/complaintStore";
import PortalLayout from "@/components/PortalLayout";
import ComplaintTimeline from "@/components/ComplaintTimeline";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge } from "@/components/Badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";

export default function TrackComplaint({ role = "citizen" }) {
  const { t, lang, toggle } = useLanguage();
  const [searchId, setSearchId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    if (idParam) {
      setSearchId(idParam);
      handleSearch(idParam);
    }
  }, []);

  const statusFilter = new URLSearchParams(window.location.search).get(
    "status",
  );
  const allCitizenComplaints = getCitizenComplaints("Ramesh Prasad");
  const filteredComplaints =
    statusFilter && statusFilter !== "all"
      ? allCitizenComplaints.filter((c) => {
          if (statusFilter === "in_progress")
            return [
              "In Progress",
              "Assigned",
              "Field Visit",
              "Pending",
            ].includes(c.status);
          if (statusFilter === "resolved")
            return ["Resolved", "Closed"].includes(c.status);
          if (statusFilter === "escalated") return c.status === "Escalated";
          return true;
        })
      : allCitizenComplaints;

  const quickTrackIds = COMPLAINTS.slice(0, 5).map((c) => c.id);

  const handleSearch = (id) => {
    if (!id.trim()) return;
    setSearched(true);
    const found = findComplaintById(id);
    setComplaint(found || null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PortalLayout role={role}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6 flex items-start justify-between no-print">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("Track Complaint", "शिकायत ट्रैक करें")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "Enter your Complaint ID to view status, timeline, and officer details.",
                "स्थिति, समयरेखा और अधिकारी विवरण देखने के लिए अपनी शिकायत आईडी दर्ज करें।",
              )}
            </p>
          </div>
          <button
            onClick={toggle}
            className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted"
          >
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-border p-5 mb-6 no-print">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchId)}
                placeholder={t(
                  "Enter Complaint ID (e.g., BH-2026-047821)",
                  "शिकायत आईडी दर्ज करें (जैसे, BH-2026-047821)",
                )}
                className="pl-10 h-11"
              />
            </div>
            <Button
              onClick={() => handleSearch(searchId)}
              className="bg-primary hover:bg-primary/90 px-8 h-11"
            >
              <Search className="w-4 h-4 mr-1" /> {t("Track", "ट्रैक")}
            </Button>
          </div>
          {!searched && (
            <div className="mt-3 text-xs text-muted-foreground">
              <span>
                {t(
                  "Try tracking these complaints: ",
                  "ये शिकायतें ट्रैक करने का प्रयास करें: ",
                )}
              </span>
              <div className="inline-flex flex-wrap gap-2 mt-1">
                {quickTrackIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSearchId(id);
                      handleSearch(id);
                    }}
                    className="px-3 py-1 bg-muted hover:bg-blue-50 hover:text-primary rounded-full font-mono text-xs transition-colors"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Previous Complaints Table - BELOW search bar */}
        {filteredComplaints.length > 0 && (
          <div className="bg-white rounded-xl border border-border overflow-hidden mb-6 no-print">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="font-bold text-foreground">
                {t("Your Previous Complaints", "आपकी पिछली शिकायतें")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t(
                  "Click any complaint ID to view full details",
                  "पूर्ण विवरण देखने के लिए किसी भी शिकायत आईडी पर क्लिक करें",
                )}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">
                      {t("Complaint ID", "शिकायत आईडी")}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {t("Service", "सेवा")}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {t("Status", "स्थिति")}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {t("Filed On", "दाखिल")}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {t("Officer", "अधिकारी")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-blue-50/50">
                      <td className="px-4 py-2.5">
                        <ComplaintId id={c.id} />
                      </td>
                      <td className="px-4 py-2.5">{c.serviceName}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {new Date(c.createdDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {c.l1OfficerName || t("Not assigned", "नियुक्त नहीं")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {complaint && (
          <div className="print-area">
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("Complaint ID", "शिकायत आईडी")}
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-primary font-mono">
                      {complaint.id}
                    </h2>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {complaint.serviceName} - {complaint.subserviceName}
                  </p>
                </div>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="shrink-0 no-print"
                >
                  <Printer className="w-4 h-4 mr-1" /> {t("Print", "प्रिंट")}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("Citizen", "नागरिक")}:
                    </span>
                    <span className="font-medium">{complaint.citizenName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("Mobile", "मोबाइल")}:
                    </span>
                    <span className="font-medium">{complaint.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("Location", "स्थान")}:
                    </span>
                    <span className="font-medium">
                      {complaint.districtName}, {complaint.ward}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("ULB", "नगर निकाय")}:
                    </span>
                    <span className="font-medium">
                      {complaint.ulbName || "-"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("Filed On", "दाखिल")}:
                    </span>
                    <span className="font-medium">
                      {new Date(complaint.createdDate).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("Source", "स्रोत")}:
                    </span>
                    <span className="font-medium capitalize">
                      {complaint.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("Assigned Officer", "नियुक्त अधिकारी")}:
                    </span>
                    <span className="font-medium">
                      {complaint.l1OfficerName ||
                        t("Not yet assigned", "अभी तक नियुक्त नहीं")}
                    </span>
                  </div>
                  {complaint.resolvedDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground">
                        {t("Resolved On", "हल")}:
                      </span>
                      <span className="font-medium">
                        {new Date(complaint.resolvedDate).toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  {t("Description", "विवरण")}
                </div>
                <p className="text-sm text-foreground">
                  {complaint.description}
                </p>
              </div>

              {complaint.deptTransfer && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  {t("Department Transfer", "विभागीय स्थानांतरण")}:{" "}
                  {t(
                    "This complaint involves multiple departments",
                    "यह शिकायत कई विभागों की है",
                  )}{" "}
                  - {complaint.deptTransfer.join(" + ")}
                </div>
              )}
            </div>

            {complaint.timeline && complaint.timeline.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">
                  {t("Complaint Timeline", "शिकायत समयरेखा")} -{" "}
                  {t("End-to-End Lifecycle", "संपूर्ण जीवनचक्र")}
                </h3>
                <ComplaintTimeline events={complaint.timeline} />
              </div>
            )}
          </div>
        )}

        {!complaint && searched && (
          <div className="bg-white rounded-xl border border-border p-12 text-center no-print">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {t(
                "No complaint found with ID",
                "इस आईडी के साथ कोई शिकायत नहीं मिली",
              )}{" "}
              "{searchId}".
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t(
                "Try one of the quick track IDs above or check your previous complaints table.",
                "ऊपर दिए गए क्विक ट्रैक आईडी में से एक आज़माएं या अपनी पिछली शिकायतों की तालिका देखें।",
              )}
            </p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
