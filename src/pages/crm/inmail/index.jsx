import React, { useMemo, useState } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FilePlus2,
  Eye,
  Paperclip,
  Calendar,
  User,
  RefreshCw,
  Send,
  ShieldAlert,
  Inbox,
} from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import StatCard from "@/components/StatCard";
import MyTable from "@/components/MyTable";
import EditDialog from "@/components/EditDialog";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { getSuccessToast, getWarningToast } from "@/utils/helpers";
import moment from "moment";

// Standard Email Inmail Dataset (strictly email protocol attributes)
const INITIAL_INMAILS = [
  {
    id: "INM-001",
    from: "Vikramaditya Pandey <v.pandey88@gmail.com>",
    fromName: "Vikramaditya Pandey",
    fromEmail: "v.pandey88@gmail.com",
    to: "grievance-support@bihar.gov.in",
    cc: "dm-patna@bihar.gov.in",
    bcc: "",
    subject: "Contaminated brown tap water supply for past 3 days in Kankarbagh",
    body: `Respected Authorities,\n\nI am writing to urgently report severe water contamination in Sector-3, Kankarbagh, Patna. The municipal tap water flowing into residential tanks is dark brown and has a foul odor since Thursday morning. Several children in our society have fallen ill with gastrointestinal issues.\n\nWe request immediate water pipeline inspection and emergency tanker deployment.\n\nThank you,\nVikramaditya Pandey`,
    receivedAt: "2026-08-31T11:30:00Z",
    status: "PENDING",
    complaintId: null,
    attachments: [
      { name: "water_sample.jpg", size: "2.1 MB" },
      { name: "society_letter.pdf", size: "640 KB" },
    ],
  },
  {
    id: "INM-002",
    from: "Sunita Kumari <sunita.k.gaya@outlook.com>",
    fromName: "Sunita Kumari",
    fromEmail: "sunita.k.gaya@outlook.com",
    to: "grievance-support@bihar.gov.in",
    cc: "energy-dept@bihar.gov.in",
    bcc: "",
    subject: "Fallen 11KV electrical wire sparking near residential lane",
    body: `Urgent attention required!\n\nDue to heavy winds last night, an overhead electrical line broke and is currently dangling just 2 feet above the main passage near Vishnupad temple lane, Gaya. Sparks were seen twice this morning. School children and cattle frequent this lane.\n\nPlease dispatch an emergency repair team immediately.\n\nRegards,\nSunita Kumari`,
    receivedAt: "2026-08-31T10:15:00Z",
    status: "PENDING",
    complaintId: null,
    attachments: [{ name: "broken_wire_site.jpg", size: "3.4 MB" }],
  },
  {
    id: "INM-003",
    from: "Anil Kumar Mishra <anil.mishra.muz@yahoo.com>",
    fromName: "Anil Kumar Mishra",
    fromEmail: "anil.mishra.muz@yahoo.com",
    to: "grievance-support@bihar.gov.in",
    cc: "commissioner-muz@bihar.gov.in",
    bcc: "",
    subject: "Drainage overflow causing knee-deep waterlogging outside Mithanpura market",
    body: `Sir,\n\nThe main storm drain near Mithanpura market, Muzaffarpur has collapsed from the center. Sewage water has flooded the entire road, blocking customer entrance to over 40 shops. Despite informing local sanitation staff twice, no action has been taken.\n\nKindly register this grievance for urgent desludging.\n\nAnil Kumar Mishra`,
    receivedAt: "2026-08-31T08:00:00Z",
    status: "CONVERTED",
    complaintId: "BH-2026-049811",
    attachments: [{ name: "drain_blockage.png", size: "1.8 MB" }],
  },
  {
    id: "INM-004",
    from: "Rajeshwar Singh <rsingh.promo@bizdeal.in>",
    fromName: "Rajeshwar Singh",
    fromEmail: "rsingh.promo@bizdeal.in",
    to: "grievance-support@bihar.gov.in",
    cc: "",
    bcc: "",
    subject: "Special commercial promotional offer for office supplies & stationery",
    body: `Dear Officer,\n\nWe are pleased to introduce our comprehensive range of stationery and office furniture at 30% discounted rates for government bodies. Please find the attached brochure for procurement inquiry.\n\nBest,\nBizDeal Enterprises`,
    receivedAt: "2026-08-31T06:45:00Z",
    status: "REJECTED",
    rejectionReason: "Commercial spam / promotional offer",
    complaintId: null,
    attachments: [{ name: "catalogue_2026.pdf", size: "4.2 MB" }],
  },
  {
    id: "INM-005",
    from: "Dr. Pratibha Jha <pratibha.jha.doc@gmail.com>",
    fromName: "Dr. Pratibha Jha",
    fromEmail: "pratibha.jha.doc@gmail.com",
    to: "grievance-support@bihar.gov.in",
    cc: "health-secretary@bihar.gov.in",
    bcc: "",
    subject: "Potholes and cave-in on primary ambulance route to Civil Hospital",
    body: `Dear Grievance Cell,\n\nThe 1.5 km stretch from Tower Chowk to Laheriasarai Hospital, Darbhanga has developed severe 2-foot deep craters due to recent rains. Ambulance transfers are severely jolted and critically ill patients are suffering. Urgent road patching required.\n\nDr. Pratibha Jha`,
    receivedAt: "2026-08-30T16:10:00Z",
    status: "PENDING",
    complaintId: null,
    attachments: [
      { name: "pothole_1.jpg", size: "2.8 MB" },
      { name: "pothole_2.jpg", size: "3.1 MB" },
    ],
  },
  {
    id: "INM-006",
    from: "Mohammad Tariq <tariq.purnia@gmail.com>",
    fromName: "Mohammad Tariq",
    fromEmail: "tariq.purnia@gmail.com",
    to: "grievance-support@bihar.gov.in",
    cc: "",
    bcc: "",
    subject: "Stray dog pack menace near primary girls school Line Bazar",
    body: `Respected Sir/Madam,\n\nA pack of 8-10 aggressive stray dogs has made the playground area outside Line Bazar Primary School, Purnia dangerous. Two students were injured last week. We request the municipal dog squad to visit promptly.\n\nThank you,\nMohammad Tariq`,
    receivedAt: "2026-08-30T13:25:00Z",
    status: "PENDING",
    complaintId: null,
    attachments: [],
  },
  {
    id: "INM-007",
    from: "Pooja Verma <pooja.verma91@yahoo.co.in>",
    fromName: "Pooja Verma",
    fromEmail: "pooja.verma91@yahoo.co.in",
    to: "grievance-support@bihar.gov.in",
    cc: "nagarnigam.begusarai@bihar.gov.in",
    bcc: "",
    subject: "Garbage dump not cleared for 5 consecutive days near residential society",
    body: `Hello,\n\nThe garbage vat at Har-Har Mahadev Chowk, Begusarai has completely overflowed onto the road. Stray animals are scattering waste everywhere and the stench has made it impossible to open windows. Please instruct sanitation team to clear it.\n\nPooja Verma`,
    receivedAt: "2026-08-30T10:40:00Z",
    status: "CONVERTED",
    complaintId: "BH-2026-049755",
    attachments: [{ name: "garbage_vat.jpg", size: "1.9 MB" }],
  },
  {
    id: "INM-008",
    from: "Sanjay Sahay <ssahay.test@domain.com>",
    fromName: "Sanjay Sahay",
    fromEmail: "ssahay.test@domain.com",
    to: "grievance-support@bihar.gov.in",
    cc: "",
    bcc: "",
    subject: "Test email - please ignore this test submission",
    body: `This is an automated test email sent to verify SMTP inbound routing. Kindly disregard.\n\nRegards,\nIT Team`,
    receivedAt: "2026-08-29T14:15:00Z",
    status: "REJECTED",
    rejectionReason: "Test submission / Non-actionable",
    complaintId: null,
    attachments: [],
  },
];

export default function Inmail() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [inmails, setInmails] = useState(INITIAL_INMAILS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Selected Inmail for Preview
  const [previewMail, setPreviewMail] = useState(null);

  // Inmail targeted for rejection dialog
  const [rejectMail, setRejectMail] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("Incomplete Information");
  const [customRemarks, setCustomRemarks] = useState("");

  // Summary counts
  const stats = useMemo(() => {
    const total = inmails.length;
    const pending = inmails.filter((m) => m.status === "PENDING").length;
    const converted = inmails.filter((m) => m.status === "CONVERTED").length;
    const rejected = inmails.filter((m) => m.status === "REJECTED").length;
    return { total, pending, converted, rejected };
  }, [inmails]);

  // Filtered inmails
  const filteredInmails = useMemo(() => {
    return inmails.filter((mail) => {
      // Tab filter
      if (activeTab === "pending" && mail.status !== "PENDING") return false;
      if (activeTab === "converted" && mail.status !== "CONVERTED") return false;
      if (activeTab === "rejected" && mail.status !== "REJECTED") return false;

      // Status dropdown
      if (statusFilter !== "all" && mail.status !== statusFilter) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          mail.id.toLowerCase().includes(q) ||
          mail.from.toLowerCase().includes(q) ||
          mail.to.toLowerCase().includes(q) ||
          mail.cc.toLowerCase().includes(q) ||
          mail.subject.toLowerCase().includes(q) ||
          mail.body.toLowerCase().includes(q) ||
          mail.complaintId?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inmails, activeTab, statusFilter, search]);

  // Handlers
  const handleRaiseComplaint = (mail) => {
    if (!mail?.id) return;
    navigate(`/crm/raise?inmail=${mail.id}`);
  };

  const handleOpenReject = (mail) => {
    setRejectMail(mail);
    setRejectionReason("Incomplete Information");
    setCustomRemarks("");
  };

  const confirmReject = () => {
    if (!rejectMail) return;
    const finalReason = customRemarks.trim()
      ? `${rejectionReason} - ${customRemarks.trim()}`
      : rejectionReason;

    setInmails((prev) =>
      prev.map((m) =>
        m.id === rejectMail.id
          ? { ...m, status: "REJECTED", rejectionReason: finalReason }
          : m
      )
    );

    getWarningToast(`Inmail ${rejectMail.id} rejected`);
    setRejectMail(null);
    if (previewMail?.id === rejectMail.id) {
      setPreviewMail((prev) => ({
        ...prev,
        status: "REJECTED",
        rejectionReason: finalReason,
      }));
    }
  };

  // Table Headers
  const tableHeaders = [
    {
      id: "inmailId",
      label: t("Ref ID", "संदर्भ आईडी"),
      isSortable: true,
      className: "w-28 font-medium",
    },
    {
      id: "from",
      label: t("From", "प्रेषक"),
      className: "min-w-[180px]",
    },
    {
      id: "toCc",
      label: t("To / CC", "प्राप्तकर्ता / CC"),
      className: "w-44",
    },
    {
      id: "subject",
      label: t("Subject & Content", "विषय एवं सामग्री"),
      className: "min-w-[280px]",
    },
    {
      id: "date",
      label: t("Received", "प्राप्त"),
      isSortable: true,
      className: "w-32",
    },
    {
      id: "status",
      label: t("Status", "स्थिति"),
      className: "w-36 text-center",
    },
    {
      id: "actions",
      label: t("Actions", "कार्रवाई"),
      className: "w-44 text-center",
    },
  ];

  // Table Body Rows
  const tableBody = filteredInmails.map((m) => ({
    inmailId: {
      render: () => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPreviewMail(m)}
            className="font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            {m.id}
          </button>
          {m.attachments?.length > 0 && (
            <span
              className="text-muted-foreground hover:text-foreground"
              title={`${m.attachments.length} attachment(s)`}
            >
              <Paperclip className="w-3 h-3" />
            </span>
          )}
        </div>
      ),
    },
    from: {
      render: () => (
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground text-xs leading-tight">
            {m.fromName}
          </p>
          <p className="text-[11px] text-muted-foreground truncate max-w-[200px]" title={m.fromEmail}>
            {m.fromEmail}
          </p>
        </div>
      ),
    },
    toCc: {
      render: () => (
        <div className="space-y-0.5 text-[11px]">
          <p className="text-muted-foreground truncate" title={m.to}>
            <span className="font-medium text-foreground">To: </span>
            {m.to.replace("@bihar.gov.in", "")}
          </p>
          {m.cc ? (
            <p className="text-muted-foreground/80 truncate text-[10px]" title={m.cc}>
              <span className="font-medium">Cc: </span>
              {m.cc.replace("@bihar.gov.in", "")}
            </p>
          ) : (
            <span className="text-[10px] text-muted-foreground/40">—</span>
          )}
        </div>
      ),
    },
    subject: {
      render: () => (
        <div
          onClick={() => setPreviewMail(m)}
          className="cursor-pointer group max-w-md"
        >
          <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {m.subject}
          </p>
          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
            {m.body}
          </p>
        </div>
      ),
    },
    date: {
      render: () => (
        <div className="text-xs text-nowrap whitespace-nowrap">
          <p className="font-medium text-foreground text-[11px]">
            {moment(m.receivedAt).format("DD MMM, hh:mm A")}
          </p>
          <p className="text-[10px] text-muted-foreground">{moment(m.receivedAt).fromNow()}</p>
        </div>
      ),
    },
    status: {
      className: "text-center",
      render: () => {
        if (m.status === "CONVERTED") {
          return (
            <div className="inline-flex flex-col items-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {t("Converted", "शिकायत दर्ज")}
              </span>
              {m.complaintId && (
                <span className="text-[10px] font-mono text-primary font-semibold mt-0.5">
                  {m.complaintId}
                </span>
              )}
            </div>
          );
        }
        if (m.status === "REJECTED") {
          return (
            <div className="inline-flex flex-col items-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                <XCircle className="w-3 h-3" />
                {t("Rejected", "अस्वीकृत")}
              </span>
            </div>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            {t("Pending", "लंबित")}
          </span>
        );
      },
    },
    actions: {
      className: "text-right",
      render: () => (
        <div className="flex items-center justify-end gap-1">
       

          {m.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 border-emerald-500/30 cursor-pointer font-medium rounded-md"
                onClick={() => handleRaiseComplaint(m)}
              >
                <FilePlus2 className="w-3 h-3 mr-1" />
                {t("Raise", "दर्ज करें")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 border-red-500/30 cursor-pointer font-medium rounded-md"
                onClick={() => handleOpenReject(m)}
              >
                <XCircle className="w-3 h-3 mr-1" />
                {t("Reject", "अस्वीकार")}
              </Button>
            </>
          )}

          {m.status === "CONVERTED" && (
            <span className="text-[11px] text-emerald-600 font-medium px-1">
              ✓ {t("Created", "दर्ज")}
            </span>
          )}

          {m.status === "REJECTED" && (
            <span className="text-[11px] text-muted-foreground px-1">
              {t("Closed", "बंद")}
            </span>
          )}
             {/* <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-white cursor-pointer rounded-md"
            onClick={() => setPreviewMail(m)}
            title={t("View Inmail", "इनमेल देखें")}
          >
            <Eye className="w-3.5 h-3.5" />
          </Button> */}
        </div>
      ),
    },
  }));

  return (
    <PortalLayout role="crm">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Title and Header */}
        <SectionTitle
          title={t("InMail", "इनमेल")}
          subtitle={t(
            "Review incoming grievance emails, raise complaints, or reject non-actionable mails.",
            "आने वाले ईमेल की समीक्षा करें, शिकायत दर्ज करें या अस्वीकार करें।"
          )}
          className="!mb-2"
        >
          {/* <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInmails(INITIAL_INMAILS);
                getSuccessToast("Inmails list refreshed");
              }}
              className="cursor-pointer text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t("Refresh", "रिफ्रेश")}
            </Button>
          </div> */}
        </SectionTitle>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Inbox}
            label={t("Total Inmails", "कुल इनमेल")}
            value={stats.total}
            color="blue"
            isClicked={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          />
          <StatCard
            icon={Clock}
            label={t("Pending Action", "लंबित कार्रवाई")}
            value={stats.pending}
            color="amber"
            isClicked={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          />
          <StatCard
            icon={CheckCircle2}
            label={t("Converted to Complaint", "शिकायत में परिवर्तित")}
            value={stats.converted}
            color="green"
            isClicked={activeTab === "converted"}
            onClick={() => setActiveTab("converted")}
          />
          <StatCard
            icon={XCircle}
            label={t("Rejected / Closed", "अस्वीकृत / बंद")}
            value={stats.rejected}
            color="red"
            isClicked={activeTab === "rejected"}
            onClick={() => setActiveTab("rejected")}
          />
        </div>

        {/* Table Container */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search by sender, email, subject...", "प्रेषक, ईमेल, विषय द्वारा खोजें...")}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder={t("All Statuses", "सभी स्थितियाँ")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("All Statuses", "सभी स्थितियाँ")}</SelectItem>
                    <SelectItem value="PENDING">{t("Pending", "लंबित")}</SelectItem>
                    <SelectItem value="CONVERTED">{t("Converted", "शिकायत दर्ज")}</SelectItem>
                    <SelectItem value="REJECTED">{t("Rejected", "अस्वीकृत")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(search || statusFilter !== "all" || activeTab !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-destructive hover:text-destructive cursor-pointer"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setActiveTab("all");
                  }}
                >
                  {t("Reset", "रीसेट")}
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <MyTable
            tableHeaders={tableHeaders}
            tableBody={tableBody}
            emptyText={t("No inmails found matching criteria.", "कोई इनमेल नहीं मिला।")}
          />
        </div>
      </div>

      {/* ── Preview Inmail EditDialog ── */}
      {previewMail && (
        <EditDialog
          title={`${previewMail.id}: ${previewMail.subject}`}
          onClose={() => setPreviewMail(null)}
          isHideFooter={true}
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-muted-foreground w-12 shrink-0">From:</span>
                <span className="font-medium text-foreground break-all">{previewMail.from}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-muted-foreground w-12 shrink-0">To:</span>
                <span className="text-foreground break-all">{previewMail.to}</span>
              </div>
              {previewMail.cc && (
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-muted-foreground w-12 shrink-0">Cc:</span>
                  <span className="text-foreground break-all">{previewMail.cc}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="font-semibold text-muted-foreground w-12 shrink-0">Date:</span>
                <span className="text-foreground">
                  {moment(previewMail.receivedAt).format("ddd, DD MMM YYYY [at] hh:mm A")}
                </span>
              </div>
            </div>

            {/* Rejection Note Banner */}
            {previewMail.status === "REJECTED" && previewMail.rejectionReason && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t("Rejection Reason:", "अस्वीकृति का कारण:")}</p>
                  <p>{previewMail.rejectionReason}</p>
                </div>
              </div>
            )}

            {/* Email Body */}
            <div>
              <p className="font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                {t("Message Body", "संदेश विवरण")}
              </p>
              <div className="bg-background rounded-lg p-3.5 border border-border whitespace-pre-wrap leading-relaxed">
                {previewMail.body}
              </div>
            </div>

            {/* Attachments Section */}
            {previewMail.attachments?.length > 0 && (
              <div>
                <p className="font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  {t("Attachments", "संलग्नक")} ({previewMail.attachments.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {previewMail.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/20"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate font-medium text-foreground">
                          {att.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {att.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 -mx-5 -mb-5 px-5 py-3 bg-card border-t border-border flex items-center justify-between z-10 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMail(null)}
                className="cursor-pointer text-xs"
              >
                {t("Close", "बंद करें")}
              </Button>

              {previewMail.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const mail = previewMail;
                      setPreviewMail(null);
                      handleOpenReject(mail);
                    }}
                    className="cursor-pointer text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    {t("Reject", "अस्वीकार")}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold"
                    onClick={() => {
                      const mail = previewMail;
                      setPreviewMail(null);
                      handleRaiseComplaint(mail);
                    }}
                  >
                    <FilePlus2 className="w-3.5 h-3.5 mr-1" />
                    {t("Raise Complaint", "शिकायत दर्ज करें")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </EditDialog>
      )}

      {/* ── Reject Inmail EditDialog ── */}
      {rejectMail && (
        <EditDialog
          title={t("Reject Inmail Communication", "इनमेल संचार अस्वीकार करें")}
          onClose={() => setRejectMail(null)}
          onSave={confirmReject}
        >
          <div className="space-y-3 text-xs">
            <p className="text-muted-foreground">
              {t(
                "Specify the reason for rejecting this email. This will mark the inmail as closed without raising a grievance.",
                "इस ईमेल को अस्वीकार करने का कारण बताएं।"
              )}
            </p>

            <div>
              <label className="font-medium text-foreground block mb-1">
                {t("Rejection Reason", "अस्वीकृति का कारण")} <span className="text-destructive">*</span>
              </label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incomplete Information">
                    {t("Incomplete / Missing Citizen Information", "अधूरी जानकारी")}
                  </SelectItem>
                  <SelectItem value="Outside Department Scope">
                    {t("Outside Department Scope / Other Jurisdiction", "विभाग के अधिकार क्षेत्र से बाहर")}
                  </SelectItem>
                  <SelectItem value="Duplicate Request">
                    {t("Duplicate Request / Already Registered", "दोहराव अनुरोध / पहले से दर्ज")}
                  </SelectItem>
                  <SelectItem value="Spam or Promotional Email">
                    {t("Spam / Commercial Promotion / Advertisement", "स्पैम / प्रचार ईमेल")}
                  </SelectItem>
                  <SelectItem value="Resolved Directly">
                    {t("Resolved Directly via Phone Call / Inquiry Only", "केवल सामान्य पूछताछ / सीधे समाधान")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                {t("Additional Remarks (Optional)", "अतिरिक्त टिप्पणी (वैकल्पिक)")}
              </label>
              <textarea
                value={customRemarks}
                onChange={(e) => setCustomRemarks(e.target.value)}
                placeholder={t("Provide any specific notes for audit trail...", "ऑडिट ट्रेल के लिए विशिष्ट टिप्पणी लिखें...")}
                className="w-full h-20 p-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </EditDialog>
      )}
    </PortalLayout>
  );
}
