import React, { useState } from "react";
import {
  useGetComplaintById,
  useGetComplaintByIdForOfficer,
} from "@/hooks/query/useGetComplaints";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  COMPLAINTS,
  CALL_TRACKER,
  OFFICERS,
  SERVICES,
  DISTRICTS,
  ULBS,
} from "@/lib/biharData";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { getFieldVisitStatusClass, IMG_BASE_URL } from "@/utils/constants";
import {
  Phone,
  MapPin,
  Building2,
  Calendar,
  Tag,
  ExternalLink,
  HardHat,
  Navigation,
  Camera,
  CheckCircle2,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { getEntityLabel } from "@/utils/helpers";

// ── Field Visit Data (shared across pages) ──
export const FIELD_VISIT_DATA = [
  {
    id: "FV-2026-0042",
    complaintId: "BH-2026-047824",
    officer: "Amit Ranjan",
    officerId: "off-003",
    ward: "Gaya Ward-03",
    district: "Gaya",
    service: "Road & Infrastructure",
    subservice: "Potholes / damaged road",
    scheduledDate: "07 Jul 2026, 10:00 AM",
    status: "Scheduled",
    priority: "High",
    photoUploaded: false,
    geoTag: "24.7914°N, 85.0002°E",
    notes:
      "Site inspection pending. Large potholes reported on Gola Road causing accidents.",
  },
  {
    id: "FV-2026-0041",
    complaintId: "BH-2026-047821",
    officer: "Rajesh Kumar Singh",
    officerId: "off-001",
    ward: "Patna Ward-12",
    district: "Patna",
    service: "Drainage & Sewerage",
    subservice: "Drain overflow / waterlogging",
    scheduledDate: "06 Jul 2026, 02:00 PM",
    status: "Completed",
    priority: "High",
    photoUploaded: true,
    geoTag: "25.6093°N, 85.1235°E",
    notes:
      "Site inspected. Drain cleaned and cover repaired. Resolution photo uploaded with geo-tag.",
  },
  {
    id: "FV-2026-0040",
    complaintId: "BH-2026-047826",
    officer: "Md. Irfan Alam",
    officerId: "off-006",
    ward: "Muzaffarpur Ward-15",
    district: "Muzaffarpur",
    service: "Animal Rescue",
    subservice: "Stray dog menace",
    scheduledDate: "06 Jul 2026, 09:00 AM",
    status: "Completed",
    priority: "High",
    photoUploaded: true,
    geoTag: "26.1209°N, 85.3647°E",
    notes: "Stray dogs relocated to animal shelter. Area secured near school.",
  },
  {
    id: "FV-2026-0039",
    complaintId: "BH-2026-047822",
    officer: "Sunita Devi",
    officerId: "off-002",
    ward: "Patna Ward-07",
    district: "Patna",
    service: "Street Lighting",
    subservice: "Street light not working",
    scheduledDate: "07 Jul 2026, 11:00 AM",
    status: "In Progress",
    priority: "Normal",
    photoUploaded: true,
    geoTag: "25.6130°N, 85.1441°E",
    notes:
      "3 street lights identified as non-functional. Bulbs being replaced. Estimated completion by evening.",
  },
  {
    id: "FV-2026-0038",
    complaintId: "BH-2026-047825",
    officer: "Nisha Kumari",
    officerId: "off-005",
    ward: "Bhagalpur Ward-22",
    district: "Bhagalpur",
    service: "Sanitation & Waste",
    subservice: "Garbage not collected",
    scheduledDate: "07 Jul 2026, 03:00 PM",
    status: "Scheduled",
    priority: "Normal",
    photoUploaded: false,
    geoTag: "25.2425°N, 86.9842°E",
    notes:
      "Visit scheduled for garbage collection assessment in Sujaganj area.",
  },
];

function getServiceName(serviceId) {
  const s = SERVICES.find((s) => s.id === serviceId);
  return s ? s.name : serviceId;
}

export function ComplaintId({ id, className = "", complaint }) {
  const [open, setOpen] = useState(false);
  const { pathname } = window.location;
  const isOfficer = pathname.startsWith("/officer");
  // console.log({complaint, id})
  /*
(
    
  */
  const nav = useNavigate();
  function navigateTo() {
    nav(
      (isOfficer ? "/officer/complaints" : "/crm/track-complaint") +
        "?complaint=" +
        complaint?.grievanceId,
    );
  }
  return (
    <>
      <button
        onClick={() => navigateTo()}
        className={`font-mono text-primary hover:underline cursor-pointer ${className}`}
      >
        {complaint?.grievanceId || id}
      </button>
      {/* <ComplaintDetailDialog
        complaintId={complaint?._id || id}
        open={open}
        onClose={() => setOpen(false)}
        // complaintData={complaint}
      /> */}
    </>
  );
}

export function CallId({ id, className = "" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`font-mono text-primary hover:underline cursor-pointer ${className}`}
      >
        {id}
      </button>
      <CallDetailDialog
        callId={id}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function OfficerId({ id, className = "" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`font-mono text-primary hover:underline cursor-pointer ${className}`}
      >
        {id}
      </button>
      <OfficerDetailDialog
        officerId={id}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function FieldVisitId({ id, className = "", visit: propVisit }) {
  const [open, setOpen] = useState(false);
  const visit = propVisit || FIELD_VISIT_DATA.find((v) => v.id === id);
  // console.log({visit});
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`font-mono text-primary hover:underline cursor-pointer ${className}`}
      >
        {id}
      </button>
      <FieldVisitDetailDialog
        visit={visit}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function ComplaintDetailDialog({
  complaintId,
  open,
  onClose,
  complaintData,
}) {
  const { t } = useLanguage();
  const { pathname } = window.location;
  const isOfficer = pathname.startsWith("/officer");

  const officerQuery = useGetComplaintByIdForOfficer(complaintId, {
    enabled: !!open && !!complaintId && isOfficer && !complaintData,
  });

  const allQuery = useGetComplaintById(complaintId, {
    enabled: !!open && !!complaintId && !isOfficer && !complaintData,
  });

  const query = isOfficer ? officerQuery : allQuery;
  const activeComplaint = query?.data?.data;
  // console.log({ activeComplaint });

  const unifiedComplaint = activeComplaint
    ? {
        status: activeComplaint.status,
        priority: activeComplaint.assignedPriority,
        source:
          getEntityLabel(activeComplaint?.channel, t) || activeComplaint?.source || "N/A",
        citizenName: activeComplaint.citizenInfo?.fullName || "N/A",
        mobile: activeComplaint.citizenInfo?.mobile || "N/A",
        districtName:
          getEntityLabel(activeComplaint.location?.district || activeComplaint.address?.district, t) || "N/A",
        ulbName:
          getEntityLabel(activeComplaint.location?.subdivision || activeComplaint.address?.subdivision, t) || "N/A",
        ward:
          getEntityLabel(activeComplaint.location?.panchayat || activeComplaint.address?.panchayat || activeComplaint.address?.villageOrWard, t) || "N/A",
        createdDate: activeComplaint.createdAt,
        serviceName:
          getEntityLabel(
            activeComplaint.classification?.service ||
              activeComplaint.classification?.subService?.service ||
              activeComplaint.serviceName,
            t,
          ) || "N/A",
        subserviceName:
          getEntityLabel(
            activeComplaint.classification?.subService,
            t,
          ) || "N/A",
        subject: activeComplaint.classification?.subject || "N/A",
        description: activeComplaint.evidence?.details || "N/A",
        l1OfficerName: activeComplaint.l1Officer?.name || "Unassigned",
        l1Officer:
          activeComplaint.l1Officer?._id || activeComplaint.l1Officer || null,
        l2OfficerName: activeComplaint.l2Officer?.name || "Unassigned",
        l2Officer:
          activeComplaint.l2Officer?._id || activeComplaint.l2Officer || null,
        resolvedDate: activeComplaint.resolvedDate || null,
        assignedOfficer: activeComplaint?.assignedOfficer?.name
          ? `${activeComplaint?.assignedOfficer?.name || ""} (${activeComplaint?.assignedOfficer?.role?.designationEnglish})`
          : "Not Assigned",
        assignedOfficerHindi: activeComplaint?.assignedOfficer?.name
          ? `${activeComplaint?.assignedOfficer?.name || ""} (${activeComplaint?.assignedOfficer?.role?.designationHindi})`
          : "Not Assigned",
      }
    : COMPLAINTS.find((c) => c.id === complaintId);

  const displayId = activeComplaint?.grievanceId || complaintId;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm lg:text-base">
            {t("Complaint Details", "शिकायत का विवरण")}
          </DialogTitle>
        </DialogHeader>
        <LoaderErrWrapper isLoading={query.isLoading} error={query.error}>
          <span className="font-mono text-primary text-xs lg:text-sm">
            {displayId}
          </span>

          {unifiedComplaint ? (
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center gap-1.5 lg:gap-2">
                <StatusBadge status={unifiedComplaint.status} />
                <PriorityBadge priority={unifiedComplaint.priority} />
                <span className="text-[10px] lg:text-xs text-muted-foreground ml-auto capitalize">
                  {unifiedComplaint.source}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 lg:gap-3 text-[10px] lg:text-xs">
                {/* <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Citizen:</span><span className="font-medium">{unifiedComplaint.citizenName}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Mobile:</span><span className="font-medium">{unifiedComplaint.mobile}</span></div> */}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {t("District:", "जिला:")}
                  </span>
                  <span className="font-medium truncate">
                    {unifiedComplaint.districtName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {t("Sub Division:", "अनुमंडल:")}
                  </span>
                  <span className="font-medium truncate">
                    {unifiedComplaint.ulbName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {t("Village / Ward:", "ग्राम / वार्ड:")}
                  </span>
                  <span className="font-medium">{unifiedComplaint.ward}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {t("Filed:", "दर्ज:")}
                  </span>
                  <span className="font-medium">
                    {new Date(unifiedComplaint.createdDate).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3">
                <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
                  {t("Service", "सेवा")}
                </div>
                <div className="font-medium text-xs lg:text-sm">
                  {unifiedComplaint.serviceName}
                </div>
              </div>
              <div>
                <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
                  {t("Description", "विवरण")}
                </div>
                <p className="text-xs lg:text-sm">
                  {unifiedComplaint.description}
                </p>
              </div>
              <div>
                <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
                  {t("Subject", "विषय")}
                </div>
                <p className="text-xs lg:text-sm">
                  {unifiedComplaint.subject ||
                    unifiedComplaint.classification?.subject ||
                    "N/A"}
                </p>
              </div>
              <div>
                <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
                  {t("Assigned Officer", "नियुक्त अधिकारी")}
                </div>
                <p className="text-xs lg:text-sm">
                  {unifiedComplaint?.assignedOfficer ||
                    t("Not Assigned", "असाइन नहीं किया गया")}
                </p>
              </div>
              {/* <div className="flex gap-2 lg:gap-3">
                <div className="flex-1 bg-primary/10 border border-primary/20 rounded-lg p-2.5 lg:p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">L1 Officer</div>
                  <div className="font-semibold text-xs lg:text-sm mt-0.5">
                    {unifiedComplaint.l1OfficerName || "Unassigned"}
                  </div>
                  {unifiedComplaint.l1Officer && (
                    <div className="text-[10px] mt-0.5">
                      <OfficerId id={unifiedComplaint.l1Officer} />
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-purple-500/10 border border-purple-500/20 rounded-lg p-2.5 lg:p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">L2 Officer</div>
                  <div className="font-semibold text-xs lg:text-sm mt-0.5">
                    {unifiedComplaint.l2OfficerName || "Unassigned"}
                  </div>
                  {unifiedComplaint.l2Officer && (
                    <div className="text-[10px] mt-0.5">
                      <OfficerId id={unifiedComplaint.l2Officer} />
                    </div>
                  )}
                </div>
              </div> */}
              {unifiedComplaint.resolvedDate && (
                <div className="text-xs lg:text-sm text-emerald-600">
                  {t("Resolved on", "समाधान की तारीख")}{" "}
                  {new Date(unifiedComplaint.resolvedDate).toLocaleDateString(
                    "en-IN",
                    { day: "2-digit", month: "short", year: "numeric" },
                  )}
                </div>
              )}
              <Link
                to={
                  (isOfficer ? "/officer/complaints" : "/crm/track-complaint") +
                  "?complaint=" +
                  displayId
                }
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View Full Timeline <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs lg:text-sm">
              {t("Complaint not found.", "शिकायत नहीं मिली।")}
            </p>
          )}
        </LoaderErrWrapper>
      </DialogContent>
    </Dialog>
  );
}

export function CallDetailDialog({ callId, open, onClose }) {
  const { t } = useLanguage();
  const call = CALL_TRACKER.find((c) => c.id === callId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t("Call Details", "कॉल विवरण")} - {callId}
          </DialogTitle>
        </DialogHeader>
        {call ? (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground">
                  {t("Time:", "समय:")}
                </span>{" "}
                <span className="font-medium">{call.time}</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t("Duration:", "अवधि:")}
                </span>{" "}
                <span className="font-medium">{call.duration}</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t("Agent:", "एजेंट:")}
                </span>{" "}
                <span className="font-medium">{call.agent}</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t("Status:", "स्थिति:")}
                </span>{" "}
                <span className="font-medium">{call.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">
                  {t("Disposition:", "निपटान:")}
                </span>{" "}
                <span className="font-medium">{call.disposition}</span>
              </div>
            </div>
            {call.complaintId && (
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-xs text-muted-foreground">
                  {t("Linked Complaint:", "संबद्ध शिकायत:")}{" "}
                </span>
                {/* <ComplaintId id={call.complaintId} /> */}
                {call.complaintId}
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            {t("Call not found.", "कॉल नहीं मिला।")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function OfficerDetailDialog({ officerId, open, onClose }) {
  const officer = OFFICERS.find((o) => o.id === officerId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-primary" /> Officer Details
            <span className="font-mono text-primary text-sm">{officerId}</span>
          </DialogTitle>
        </DialogHeader>
        {officer ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {officer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div className="font-bold text-lg">{officer.name}</div>
                <Badge
                  variant="outline"
                  className={`text-xs ${officer.designation === "l1-officer" ? "bg-primary/10 text-primary" : officer.designation === "l2-officer" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}
                >
                  {officer.designationLabel}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">District:</span>
                <span className="font-medium">
                  {DISTRICTS.find((d) => d.id === officer.district)?.name ||
                    officer.district}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">ULB:</span>
                <span className="font-medium">
                  {ULBS.find((u) => u.id === officer.ulb)?.name || officer.ulb}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Mobile:</span>
                <span className="font-medium">{officer.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${officer.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted/50 text-muted-foreground"}`}
                >
                  {officer.status}
                </Badge>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">
                Department / Services Assigned
              </div>
              <div className="flex flex-wrap gap-1.5">
                {officer.services.length > 0 ? (
                  officer.services.map((sId) => (
                    <Badge
                      key={sId}
                      variant="outline"
                      className="text-xs bg-primary/10 text-primary"
                    >
                      {getServiceName(sId)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    All services (admin level)
                  </span>
                )}
              </div>
            </div>
            {officer.wards.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Assigned Wards
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {officer.wards.map((w) => (
                    <Badge
                      key={w}
                      variant="outline"
                      className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    >
                      {w}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-emerald-500/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-emerald-600">
                  {officer.resolved}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Resolved
                </div>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-amber-600">
                  {officer.pending}
                </div>
                <div className="text-[10px] text-muted-foreground">Pending</div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-red-600">
                  {officer.slaBreached}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  SLA Breach
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {officer.avgResolutionHrs}h
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Avg Resolve
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Officer not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function FieldVisitDetailDialog({
  visitId,
  visit: propVisit,
  open,
  onClose,
}) {
  const { t, lang } = useLanguage();
  const rawVisit = propVisit;
  if (!rawVisit) return null;

  const isApiObject = !!(
    rawVisit._id ||
    rawVisit.grievance ||
    rawVisit.serviceDetails
  );

  const loc = rawVisit?.grievance?.location || {};
  const isUrban = Boolean(loc.isUrban);
  const districtName =
    getEntityLabel(loc.district || rawVisit.address?.district || rawVisit.district, t) || "";
  const urbanPanchayatName =
    getEntityLabel(loc.urbanPanchayat || rawVisit.address?.urbanPanchayat, t) || "";
  const wardName =
    getEntityLabel(loc.ward || rawVisit.address?.ward || rawVisit.ward, t) || "";
  const villageName =
    getEntityLabel(loc.village || rawVisit.address?.village, t) || "";
  const panchayatName =
    getEntityLabel(loc.panchayat || rawVisit.address?.panchayat, t) || "";
  const blockName =
    getEntityLabel(loc.block || loc.subdivision || rawVisit.address?.block || rawVisit.address?.subdivision, t) || "";
  const divisionName = getEntityLabel(loc.division, t) || "";
  const pincode = loc.pincode || loc.pinCode || rawVisit.address?.pincode;

  const locationParts = (isUrban
    ? [wardName, urbanPanchayatName, districtName, pincode]
    : [
        villageName,
        panchayatName,
        blockName,
        districtName,
        pincode,
      ]
  ).filter(Boolean);

  const locationText =
    locationParts.length > 0
      ? locationParts.join(", ")
      : divisionName || rawVisit.ward || "N/A";

  const visit = {
    id: isApiObject ? rawVisit.visitId || rawVisit._id : rawVisit.id,
    status: rawVisit.status || "PENDING",
    priority: isApiObject
      ? rawVisit.grievance?.assignedPriority || "NORMAL"
      : rawVisit.priority || "NORMAL",
    citizenName:
      rawVisit.grievance?.citizenInfo?.fullName ||
      rawVisit.citizenName ||
      "N/A",
    citizenMobile:
      rawVisit.grievance?.citizenInfo?.mobile ||
      rawVisit.citizenMobile ||
      "N/A",
    schedule:
      rawVisit.schedule || rawVisit.scheduledDate
        ? (() => {
            const dateStr = rawVisit.schedule || rawVisit.scheduledDate;
            return String(dateStr).includes("T")
              ? new Date(dateStr).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : dateStr;
          })()
        : "N/A",
    complaintDate: rawVisit.grievance?.createdAt
      ? new Date(rawVisit.grievance.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A",
    service: isApiObject
      ? getEntityLabel(
          rawVisit.serviceDetails || rawVisit.grievance?.classification?.service,
          t,
        ) || "N/A"
      : rawVisit.service || "N/A",
    complaintId: isApiObject
      ? rawVisit.grievance?.grievanceId || rawVisit.grievance?._id || "N/A"
      : rawVisit.complaintId || "N/A",
    complaint: isApiObject ? rawVisit.grievance : null,
    geoTag: isApiObject
      ? (() => {
          const coords = rawVisit.grievance?.geotaggedImages?.find(
            (g) => g?.coordinates,
          )?.coordinates;
          return coords?.latitude && coords?.longitude
            ? `${String(coords.latitude).slice(0, 7)} | ${String(coords.longitude).slice(0, 7)}`
            : "N/A";
        })()
      : rawVisit.geoTag || "N/A",
    geotaggedImages: rawVisit.grievance?.geotaggedImages || [],
    notes: isApiObject ? rawVisit.remarks || "N/A" : rawVisit.notes || "N/A",
    location: locationText,
    district: districtName || "N/A",
    panchayat: panchayatName || "N/A",
    block: blockName || "N/A",
    subdivision: subdivisionName || "N/A",
    division: divisionName || "N/A",
    pincode: loc.pincode || loc.pinCode || rawVisit.address?.pincode || "N/A",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5 lg:gap-2 text-sm lg:text-base">
            <Navigation className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />{" "}
            {t("Field Visit Details", "फील्ड विजिट विवरण")}
            <span className="font-mono text-primary text-[10px] lg:text-sm">
              {visit.id}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] lg:text-xs ${getFieldVisitStatusClass(visit.status)}`}
            >
              {visit.status}
            </Badge>
            <PriorityBadge priority={visit.priority} />
          </div>

          <div className="grid grid-cols-2 gap-2 lg:gap-3 text-[10px] lg:text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                {t("Scheduled:", "निर्धारित:")}
              </span>
              <span className="font-medium">{visit.schedule}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                {t("Complaint Date:", "शिकायत की तारीख:")}
              </span>
              <span className="font-medium">{visit.complaintDate}</span>
            </div>

            {visit.citizenName !== "N/A" && (
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {t("Citizen:", "नागरिक:")}
                </span>
                <span className="font-medium">{visit.citizenName}</span>
              </div>
            )}
            {visit.citizenMobile !== "N/A" && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {t("Mobile:", "मोबाइल:")}
                </span>
                <span className="font-medium">{visit.citizenMobile}</span>
              </div>
            )}
          </div>

          {/* Service Section */}
          <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3">
            <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
              {t("Service", "सेवा")}
            </div>
            <div className="font-medium text-xs lg:text-sm">
              {visit.service}
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3 space-y-1.5">
            <div className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wide font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              {t("Location Details", "स्थान का विवरण")}
            </div>
            <div className="text-xs lg:text-sm font-medium">
              {visit.location}
            </div>
            {(visit.district !== "N/A" || visit.block !== "N/A") && (
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                {visit.panchayat !== "N/A" && (
                  <div>
                    <span className="font-medium text-foreground">
                      {t("Panchayat:", "पंचायत:")}{" "}
                    </span>
                    {visit.panchayat}
                  </div>
                )}
                {visit.block !== "N/A" && (
                  <div>
                    <span className="font-medium text-foreground">
                      {t("Block:", "प्रखंड:")}{" "}
                    </span>
                    {visit.block}
                  </div>
                )}
                {visit.subdivision !== "N/A" && (
                  <div>
                    <span className="font-medium text-foreground">
                      {t("Subdivision:", "अनुमंडल:")}{" "}
                    </span>
                    {visit.subdivision}
                  </div>
                )}
                {visit.district !== "N/A" && (
                  <div>
                    <span className="font-medium text-foreground">
                      {t("District:", "जिला:")}{" "}
                    </span>
                    {visit.district}
                  </div>
                )}
                {visit.division !== "N/A" && (
                  <div>
                    <span className="font-medium text-foreground">
                      {t("Division:", "प्रमंडल:")}{" "}
                    </span>
                    {visit.division}
                  </div>
                )}
                {visit.pincode !== "N/A" && (
                  <div>
                    <span className="font-medium text-foreground">
                      {t("Pincode:", "पिनकोड:")}{" "}
                    </span>
                    {visit.pincode}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Complaint Link */}
          <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3">
            <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
              {t("Complaint ID", "शिकायत आईडी")}
            </div>
            {visit.complaintId && visit.complaintId !== "N/A" ? (
              <ComplaintId id={visit.complaintId} complaint={visit.complaint} />
            ) : (
              "N/A"
            )}
          </div>

          {/* Geo-Tag & Images */}
          <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3 space-y-2">
            <div className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wide font-semibold flex items-center justify-between">
              <span>{t("Geo-Tag Coordinates", "जियो-टैग निर्देशांक")}</span>
              <span className="font-mono text-xs text-foreground">
                {visit.geoTag}
              </span>
            </div>
            {visit.geotaggedImages && visit.geotaggedImages.length > 0 && (
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">
                  {t("Geotagged Photos:", "जियोटैग की गई तस्वीरें:")}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {visit.geotaggedImages.map((img, idx) => {
                    const url =
                      typeof img === "string" ? img : img?.url || img?.path || "";
                    const displayUrl = url.startsWith("http")
                      ? url
                      : IMG_BASE_URL + url;
                    return (
                      <a
                        key={idx}
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline bg-background/80 px-2 py-1 rounded border border-border"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-500" />
                        <span>
                          {t("Photo", "फोटो")} #{idx + 1}
                        </span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notes / Remarks */}
          <div>
            <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
              {t("Visit Notes / Remarks", "विजिट टिप्पणी")}
            </div>
            <p className="text-xs lg:text-sm text-foreground bg-muted/20 p-2.5 rounded-lg border border-border/50">
              {visit.notes || "N/A"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
