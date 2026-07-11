import React, { useState } from "react";
import {
  CheckCircle2,
  MapPin,
  Map as MapIcon,
  AlertTriangle,
  X,
  Camera,
  Upload,
  Loader2,
  FileText,
} from "lucide-react";
import { COMPLAINTS } from "@/lib/biharData";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge } from "@/components/Badges";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = [
  "Pending",
  "Assigned",
  "In Progress",
  "Field Visit",
  "On Hold",
  "Resolved",
  "Rejected",
  "Closed",
];

function ActionDialog({ title, onClose, children, footer }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuickActions({ officer }) {
  const [activeAction, setActiveAction] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [escalateDone, setEscalateDone] = useState(false);
  const [statusDone, setStatusDone] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  const myComplaints = COMPLAINTS.filter(
    (c) => c.l1Officer === officer.id || c.l2Officer === officer.id,
  );
  const fieldVisitComplaints = myComplaints
    .filter((c) => c.status === "Field Visit" || c.status === "In Progress")
    .slice(0, 4);

  const close = () => {
    setActiveAction(null);
    setSelectedComplaint(null);
    setNewStatus("");
    setNotes("");
    setUploadDone(false);
    setEscalateDone(false);
    setStatusDone(false);
    setReportDone(false);
  };

  const actions = [
    {
      id: "update-status",
      label: "Update Status",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      id: "geo-photo",
      label: "Upload Geo-Tag Photo",
      icon: MapPin,
      color: "bg-blue-50 text-primary",
    },
    {
      id: "field-report",
      label: "Field Visit Report",
      icon: MapIcon,
      color: "bg-purple-50 text-purple-600",
    },
    {
      id: "escalate",
      label: "Escalate to L2",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
    },
  ];

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadDone(true);
    }, 1500);
  };

  const handleEscalate = () => {
    setEscalating(true);
    setTimeout(() => {
      setEscalating(false);
      setEscalateDone(true);
    }, 1500);
  };

  const handleStatusUpdate = () => {
    setStatusDone(true);
    setTimeout(close, 1500);
  };

  const handleFieldReport = () => {
    setReportDone(true);
    setTimeout(close, 1500);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => setActiveAction(a.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${a.color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Update Status Dialog */}
      {activeAction === "update-status" && (
        <ActionDialog
          title="Update Complaint Status"
          onClose={close}
          footer={
            <>
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedComplaint || !newStatus || statusDone}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {statusDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Updated!
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </>
          }
        >
          <div>
            <Label className="mb-1.5 block">Select Complaint *</Label>
            <Select
              value={selectedComplaint}
              onValueChange={setSelectedComplaint}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a complaint" />
              </SelectTrigger>
              <SelectContent>
                {myComplaints.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.id} - {c.serviceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedComplaint && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <ComplaintId id={selectedComplaint} className="text-xs" />
                <StatusBadge
                  status={
                    myComplaints.find((c) => c.id === selectedComplaint)?.status
                  }
                />
              </div>
              <div className="text-muted-foreground">
                {
                  myComplaints.find((c) => c.id === selectedComplaint)
                    ?.subserviceName
                }
              </div>
            </div>
          )}
          <div>
            <Label className="mb-1.5 block">New Status *</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">Action Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this status change..."
              rows={3}
            />
          </div>
        </ActionDialog>
      )}

      {/* Upload Geo-Tag Photo Dialog */}
      {activeAction === "geo-photo" && (
        <ActionDialog
          title="Upload Geo-Tag Photo"
          onClose={close}
          footer={
            <>
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading || uploadDone}
                className="bg-primary hover:bg-primary/90"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />{" "}
                    Uploading...
                  </>
                ) : uploadDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Uploaded!
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" /> Upload
                  </>
                )}
              </Button>
            </>
          }
        >
          <div>
            <Label className="mb-1.5 block">Link to Complaint *</Label>
            <Select
              value={selectedComplaint}
              onValueChange={setSelectedComplaint}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a complaint" />
              </SelectTrigger>
              <SelectContent>
                {myComplaints.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.id} - {c.serviceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {uploadDone ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-emerald-700">
                Photo uploaded & geo-tagged successfully!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                GPS: 25.6128°N, 85.1442°E • Attached to {selectedComplaint}
              </p>
            </div>
          ) : (
            <div>
              <Label className="mb-1.5 block">Photo / Document</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Camera className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  PNG, JPG up to 10MB - GPS auto-captured
                </p>
              </div>
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Geo-tag will be captured
                automatically from device GPS
              </div>
            </div>
          )}
        </ActionDialog>
      )}

      {/* Field Visit Report Dialog */}
      {activeAction === "field-report" && (
        <ActionDialog
          title="Submit Field Visit Report"
          onClose={close}
          footer={
            <>
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button
                onClick={handleFieldReport}
                disabled={!selectedComplaint || !notes || reportDone}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {reportDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Submitted!
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-1" /> Submit Report
                  </>
                )}
              </Button>
            </>
          }
        >
          <div>
            <Label className="mb-1.5 block">Complaint Visited *</Label>
            <Select
              value={selectedComplaint}
              onValueChange={setSelectedComplaint}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a complaint" />
              </SelectTrigger>
              <SelectContent>
                {fieldVisitComplaints.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.id} - {c.serviceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">Visit Findings *</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what you found at the site, action taken, current condition..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block">Visit Date</Label>
              <input
                type="date"
                defaultValue="2026-07-07"
                className="w-full px-3 py-2 text-sm border border-input rounded-md"
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Resolution Status</Label>
              <Select defaultValue="in-progress">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">Still In Progress</SelectItem>
                  <SelectItem value="resolved">Mark as Resolved</SelectItem>
                  <SelectItem value="needs-escalation">
                    Needs Escalation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {reportDone && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
              ✓ Field visit report submitted. Complaint timeline updated.
            </div>
          )}
        </ActionDialog>
      )}

      {/* Escalate to L2 Dialog */}
      {activeAction === "escalate" && (
        <ActionDialog
          title="Escalate to L2 Officer"
          onClose={close}
          footer={
            <>
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button
                onClick={handleEscalate}
                disabled={!selectedComplaint || escalating || escalateDone}
                className="bg-red-600 hover:bg-red-700"
              >
                {escalating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />{" "}
                    Escalating...
                  </>
                ) : escalateDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Escalated!
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-1" /> Confirm
                    Escalation
                  </>
                )}
              </Button>
            </>
          }
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Escalating sends the complaint to the L2 Supervisory Officer. The
              citizen will receive an SMS notification. This action is logged in
              the audit trail.
            </span>
          </div>
          <div>
            <Label className="mb-1.5 block">Complaint to Escalate *</Label>
            <Select
              value={selectedComplaint}
              onValueChange={setSelectedComplaint}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a complaint" />
              </SelectTrigger>
              <SelectContent>
                {myComplaints
                  .filter(
                    (c) =>
                      !["Resolved", "Closed", "Withdrawn"].includes(c.status),
                  )
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.id} - {c.serviceName} ({c.status})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {selectedComplaint && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <div className="flex items-center gap-2">
                <ComplaintId id={selectedComplaint} className="text-xs" />
                <StatusBadge
                  status={
                    myComplaints.find((c) => c.id === selectedComplaint)?.status
                  }
                />
              </div>
              <div className="text-muted-foreground">
                SLA:{" "}
                {myComplaints.find((c) => c.id === selectedComplaint)?.slaHours}
                h
              </div>
            </div>
          )}
          <div>
            <Label className="mb-1.5 block">Escalation Reason</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why is this being escalated? (e.g., resource constraints, needs higher authority...)"
              rows={3}
            />
          </div>
          {escalateDone && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
              ✓ Complaint escalated to L2 Supervisory Officer. SMS sent to
              citizen. Audit log updated.
            </div>
          )}
        </ActionDialog>
      )}
    </>
  );
}
