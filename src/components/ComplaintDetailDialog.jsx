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
import { getFieldVisitStatusClass } from "@/utils/constants";
import {
  User,
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
  // console.log({complaint, id})
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`font-mono text-primary hover:underline cursor-pointer ${className}`}
      >
        {complaint?.grievanceId || id}
      </button>
      <ComplaintDetailDialog
        complaintId={complaint?._id || id}
        open={open}
        onClose={() => setOpen(false)}
        // complaintData={complaint}
      />
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
  console.log({visit});
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
        source: activeComplaint.source || "online",
        citizenName: activeComplaint.citizenInfo?.fullName || "-",
        mobile: activeComplaint.citizenInfo?.mobile || "-",
        districtName: activeComplaint.address?.district?.name || "-",
        ulbName: activeComplaint.address?.subdivision || "-",
        ward: activeComplaint.address?.villageOrWard || "-",
        createdDate: activeComplaint.createdAt,
        serviceName:
          activeComplaint.classification?.subService?.service?.title || "-",
        subserviceName:
          activeComplaint.classification?.subService?.title || "-",
        description: activeComplaint.evidence?.details || "-",
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Complaint Details
          </DialogTitle>
        </DialogHeader>
        <LoaderErrWrapper isLoading={query.isLoading} error={query.error}>
          <span className="font-mono text-primary">{displayId}</span>

          {unifiedComplaint ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={unifiedComplaint.status} />
                <PriorityBadge priority={unifiedComplaint.priority} />
                <span className="text-xs text-muted-foreground ml-auto capitalize">
                  {unifiedComplaint.source}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {/* <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Citizen:</span><span className="font-medium">{unifiedComplaint.citizenName}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Mobile:</span><span className="font-medium">{unifiedComplaint.mobile}</span></div> */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">District:</span>
                  <span className="font-medium">
                    {unifiedComplaint.districtName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ULB:</span>
                  <span className="font-medium">
                    {unifiedComplaint.ulbName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ward:</span>
                  <span className="font-medium">{unifiedComplaint.ward}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Filed:</span>
                  <span className="font-medium">
                    {new Date(unifiedComplaint.createdDate).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Service
                </div>
                <div className="font-medium">
                  {unifiedComplaint.serviceName} -{" "}
                  {unifiedComplaint.subserviceName}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Description
                </div>
                <p className="text-sm">{unifiedComplaint.description}</p>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Assigned Officer
                </div>
                <p className="text-sm">
                  {unifiedComplaint?.assignedOfficer || "Not Assigned"}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">
                    L1 Officer
                  </div>
                  <div className="font-semibold text-sm">
                    {unifiedComplaint.l1OfficerName || "Unassigned"}
                  </div>
                  {unifiedComplaint.l1Officer && (
                    <div className="text-[11px] mt-0.5">
                      <OfficerId id={unifiedComplaint.l1Officer} />
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">
                    L2 Officer
                  </div>
                  <div className="font-semibold text-sm">
                    {unifiedComplaint.l2OfficerName || "Unassigned"}
                  </div>
                  {unifiedComplaint.l2Officer && (
                    <div className="text-[11px] mt-0.5">
                      <OfficerId id={unifiedComplaint.l2Officer} />
                    </div>
                  )}
                </div>
              </div>
              {unifiedComplaint.resolvedDate && (
                <div className="text-sm text-emerald-600">
                  Resolved on{" "}
                  {new Date(unifiedComplaint.resolvedDate).toLocaleDateString(
                    "en-IN",
                    { day: "2-digit", month: "short", year: "numeric" },
                  )}
                </div>
              )}
              {/* <Link
              to="#"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View Full Timeline <ExternalLink className="w-3 h-3" />
            </Link> */}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Complaint not found.
            </p>
          )}
        </LoaderErrWrapper>
      </DialogContent>
    </Dialog>
  );
}

export function CallDetailDialog({ callId, open, onClose }) {
  const call = CALL_TRACKER.find((c) => c.id === callId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Call Details - {callId}</DialogTitle>
        </DialogHeader>
        {call ? (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground">Time:</span>{" "}
                <span className="font-medium">{call.time}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>{" "}
                <span className="font-medium">{call.duration}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Agent:</span>{" "}
                <span className="font-medium">{call.agent}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>{" "}
                <span className="font-medium">{call.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Disposition:</span>{" "}
                <span className="font-medium">{call.disposition}</span>
              </div>
            </div>
            {call.complaintId && (
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-xs text-muted-foreground">
                  Linked Complaint:{" "}
                </span>
                {/* <ComplaintId id={call.complaintId} /> */}
                {call.complaintId}
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Call not found.</p>
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
                  className={`text-xs ${officer.designation === "l1-officer" ? "bg-blue-50 text-blue-700" : officer.designation === "l2-officer" ? "bg-purple-50 text-purple-700" : "bg-emerald-50 text-emerald-700"}`}
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
                  className={`text-xs ${officer.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"}`}
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
                      className="text-xs bg-blue-50 text-primary"
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
                      className="text-xs bg-purple-50 text-purple-700"
                    >
                      {w}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-emerald-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-emerald-600">
                  {officer.resolved}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Resolved
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-amber-600">
                  {officer.pending}
                </div>
                <div className="text-[10px] text-muted-foreground">Pending</div>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-red-600">
                  {officer.slaBreached}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  SLA Breach
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
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
  const rawVisit = propVisit || FIELD_VISIT_DATA.find((v) => v.id === visitId);
  if (!rawVisit) return null;

  const isApiObject = !!(
    rawVisit._id ||
    rawVisit.grievance ||
    rawVisit.serviceDetails
  );

  const visit = {
    id: isApiObject ? rawVisit.visitId || rawVisit._id : rawVisit.id,
    status: rawVisit.status || "-",
    priority: isApiObject
      ? rawVisit.grievance?.assignedPriority || "NORMAL"
      : rawVisit.priority || "NORMAL",
    officer: isApiObject
      ? rawVisit.officer?.name || "-"
      : rawVisit.officer || "-",
    officerId: isApiObject
      ? rawVisit.officer?._id || "-"
      : rawVisit.officerId || "-",
    ward: isApiObject
      ? rawVisit.address?.villageOrWard ||
        rawVisit.grievance?.address?.villageOrWard ||
        "-"
      : rawVisit.ward || "-",
    district: isApiObject
      ? rawVisit.address?.district?.name ||rawVisit.address?.district || 
       rawVisit?.grievance?.address?.district?.name||  rawVisit?.grievance?.address?.district ||
        "-"
      : rawVisit.district || "-",
    scheduledDate:
      rawVisit.schedule || rawVisit.scheduledDate
        ? (() => {
            const dateStr = rawVisit.schedule || rawVisit.scheduledDate;
            return dateStr.includes("-") || dateStr.includes("T")
              ? new Date(dateStr).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : dateStr;
          })()
        : "-",
    photoUploaded: isApiObject
      ? rawVisit.grievance?.geotaggedImages?.length > 0
      : rawVisit.photoUploaded,
    service: isApiObject
      ? rawVisit.serviceDetails?.title || "-"
      : rawVisit.service || "-",
    subservice: isApiObject
      ? rawVisit.subServiceDetails?.title || "-"
      : rawVisit.subservice || "-",
    complaintId: isApiObject
      ? rawVisit.grievance?._id || rawVisit.grievance?.grievanceId || "-"
      : rawVisit.complaintId || "-",
    complaint: isApiObject ? rawVisit.grievance : null,
    geoTag: isApiObject
      ? (() => {
          const coords = rawVisit.grievance?.geotaggedImages?.[0]?.coordinates;
          return coords?.latitude && coords?.longitude
            ? `${String(coords.latitude).slice(0, 6)} | ${String(coords.longitude).slice(0, 6)}`
            : "-";
        })()
      : rawVisit.geoTag || "-",
    notes: isApiObject ? rawVisit.remarks || "-" : rawVisit.notes || "-",
  };
  console.log({visit, rawVisit}, "asdf")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" /> Field Visit Details
            <span className="font-mono text-primary text-sm">{visit.id}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${getFieldVisitStatusClass(visit.status)}`}
            >
              {visit.status}
            </Badge>
            <PriorityBadge priority={visit.priority} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Officer:</span>
                <span className="font-medium">{visit.officer || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Officer ID:</span>
                <OfficerId id={visit.officerId || "-"} />
              </div> */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Ward:</span>
              <span className="font-medium">{visit.ward || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">District:</span>
              <span className="font-medium">{visit.district || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Scheduled:</span>
              <span className="font-medium">
                {visit.scheduledDate
                  ? visit.scheduledDate.includes("-") ||
                    visit.scheduledDate.includes("T")
                    ? new Date(visit.scheduledDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : visit.scheduledDate
                  : "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Photo:</span>
              {visit.photoUploaded ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <span className="text-xs text-amber-600">Pending</span>
              )}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Service</div>
            <div className="font-medium">
              {visit.service || "-"} - {visit.subservice || "-"}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">
              Complaint ID
            </div>
            {visit.complaintId && visit.complaintId !== "-" ? (
              <ComplaintId id={visit.complaintId} complaint={visit.complaint} />
            ) : (
              "-"
            )}
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Geo-Tag</div>
            <div className="font-mono text-sm">{visit.geoTag || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Visit Notes
            </div>
            <p className="text-sm">{visit.notes || "-"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
