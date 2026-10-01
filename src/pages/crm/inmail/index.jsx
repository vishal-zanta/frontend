import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useGetInmails, useGetInmailStats } from "@/hooks/query/useGetInmails";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

import InmailStats from "./components/InmailStats";
import InmailFilters from "./components/InmailFilters";
import InmailTable from "./components/InmailTable";
import InmailPreviewDialog from "./components/InmailPreviewDialog";
import InmailRejectDialog from "./components/InmailRejectDialog";
import InmailCloseDialog from "./components/InmailCloseDialog";
import { useAuth } from "@/context/AuthContext";

export default function Inmail() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {profiledata} = useAuth();

  const { page, limit, setPage, setLimit, limitOptions } = usePagination();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [period, setPeriod] = useState("monthly");
  const [dateRange, setDateRange] = useState({});
  const [filters, setFilters] = useState({});

  const filterOptions = useMemo(
    () => [
      {
        filterKey: "status",
        label: t("Status", "स्थिति"),
        options: [
          { label: t("Pending", "लंबित"), value: "PENDING" },
          { label: t("Converted", "शिकायत में परिवर्तित"), value: "CONVERTED" },
          { label: t("Rejected", "अस्वीकृत"), value: "REJECTED" },
          { label: t("Closed", "बंद"), value: "CLOSED" },
        ],
      },
    ],
    [t],
  );

  const queryParams = useMemo(() => {
    const params = { page, limit };
    if (search.trim()) params.search = search.trim();

    const statusVal =
      filters.status ||
      (activeTab !== "all" ? activeTab.toUpperCase() : undefined);
    if (statusVal) {
      params.status = statusVal;
    }

    if (period && period !== "custom") {
      params.period = period;
    }
    if (dateRange?.from) {
      params.fromDate = dateRange.from;
      params.startDate = dateRange.from;
    }
    if (dateRange?.to) {
      params.toDate = dateRange.to;
      params.endDate = dateRange.to;
    }

    return params;
  }, [page, limit, search, filters.status, activeTab, period, dateRange]);

  const statsParams = useMemo(() => {
    const params = {};
    if (period && period !== "custom") {
      params.period = period;
    }
    if (dateRange?.from) {
      params.fromDate = dateRange.from;
      params.startDate = dateRange.from;
    }
    if (dateRange?.to) {
      params.toDate = dateRange.to;
      params.endDate = dateRange.to;
    }
    return params;
  }, [period, dateRange]);

  // Fetch inmails data from API
  const {
    data: inmailsApiData,
    isLoading: inmailsLoading,
    error: inmailsError,
  } = useGetInmails([queryParams], queryParams);

  // Fetch stats from API
  const { data: statsApiData } = useGetInmailStats([statsParams], statsParams);

  const inmailDocs = inmailsApiData?.data?.data?.docs || [];
  const inmailPagination = inmailsApiData?.data?.data?.pagination || {};
  const totalPages = inmailPagination.totalPages || 1;

  // Selected Inmail for Preview
  const [previewMail, setPreviewMail] = useState(null);

  // Inmail targeted for rejection dialog
  const [rejectMail, setRejectMail] = useState(null);

  // Inmail targeted for closure dialog
  const [closeMail, setCloseMail] = useState(null);

  // Summary counts from /emails/stats
  const stats = useMemo(() => {
    const apiStats = statsApiData?.data?.data || {};
    return {
      total: apiStats.total ?? inmailPagination.totalCount ?? inmailDocs.length,
      pending: apiStats.PENDING ?? 0,
      converted: apiStats.CONVERTED ?? 0,
      rejected: apiStats.REJECTED ?? 0,
      closed: apiStats.CLOSED ?? 0,
    };
  }, [statsApiData, inmailPagination.totalCount, inmailDocs.length]);

  // Sync filters.status with activeTab
  useEffect(() => {
    if (filters.status) {
      setActiveTab(filters.status.toLowerCase());
    } else {
      setActiveTab("all");
    }
  }, [filters.status]);

  // Filtered inmails
  const filteredInmails = useMemo(() => {
    return inmailDocs.filter((mail) => {
      // Tab filter
      if (activeTab === "pending" && mail.status !== "PENDING") return false;
      if (activeTab === "converted" && mail.status !== "CONVERTED")
        return false;
      if (activeTab === "rejected" && mail.status !== "REJECTED") return false;
      if (activeTab === "closed" && mail.status !== "CLOSED") return false;

      // Status filter
      if (filters.status && mail.status !== filters.status) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          mail.emailId?.toLowerCase().includes(q) ||
          mail.fromName?.toLowerCase().includes(q) ||
          mail.fromEmail?.toLowerCase().includes(q) ||
          mail.subject?.toLowerCase().includes(q) ||
          mail.body?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inmailDocs, activeTab, filters.status, search]);

  // Handlers
  const handleRaiseComplaint = (mail) => {
    if (!profiledata?.isCCE) return;
    const mailId = mail?._id;
    if (!mailId) return;
    navigate(`/crm/raise?inmail=${mailId}`, {
      state: {
        INITIAL_INMAILS: {
          id: mailId,
          fromEmail: mail.fromEmail,
          fromName: mail.fromName,
          body: mail.body,
          emailId: mail?.emailId,
        },
      },
    });
  };

  const handleOpenReject = (mail) => {
    if (!profiledata?.isCCE) return;
    setRejectMail(mail);
  };

  const handleOpenClose = (mail) => {
    if (!profiledata?.isCCE) return;
    setCloseMail(mail);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      setFilters((prev) => {
        const next = { ...prev };
        delete next.status;
        return next;
      });
    } else {
      setFilters((prev) => ({
        ...prev,
        status: tab.toUpperCase(),
      }));
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilters({});
    setActiveTab("all");
    setPeriod("monthly");
    setDateRange({});
    setPage(1);
  };

  return (
    <PortalLayout role="crm">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Title and Header */}
        <SectionTitle
          title={t("Email Complaint", "ईमेल")}
          subtitle={t(
            "Review incoming grievance emails, raise complaints, close inquiries, or reject spam mails.",
            "आने वाले ईमेल की समीक्षा करें, शिकायत दर्ज करें, पूछताछ बंद करें या स्पैम अस्वीकार करें।",
          )}
          className="!mb-2"
        />

        {/* Quick Stat Cards */}
        <InmailStats
          stats={stats}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Table Container */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Search & Filter Bar */}
          <InmailFilters
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            period={period}
            setPeriod={(val) => {
              setPeriod(val);
              setPage(1);
            }}
            dateRange={dateRange}
            setDateRange={(val) => {
              setDateRange(val);
              setPage(1);
            }}
            filters={filters}
            setFilters={(val) => {
              
              console.log({filters, val})
              setFilters(val);
              setPage(1);
            }}
            // setFilters={setFilters}
            filterOptions={filterOptions}
            activeTab={activeTab}
            onReset={handleResetFilters}
          />

          {/* Table with Loader & Pagination */}
          <LoaderErrWrapper isLoading={inmailsLoading} error={inmailsError}>
            <InmailTable
              inmails={filteredInmails}
              onPreview={(mail) => setPreviewMail(mail)}
              onRaiseComplaint={handleRaiseComplaint}
              onOpenReject={handleOpenReject}
              onOpenClose={handleOpenClose}
              isCCE={profiledata?.isCCE}
              pagination={
                <Pagination
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                  totalPage={totalPages}
                  limitOptions={limitOptions}
                  isLoading={inmailsLoading}
                />
              }
            />
          </LoaderErrWrapper>
        </div>
      </div>

      {/* ── Preview Inmail EditDialog ── */}
      <InmailPreviewDialog
        mail={previewMail}
        onClose={() => setPreviewMail(null)}
        onOpenReject={handleOpenReject}
        onOpenClose={handleOpenClose}
        onRaiseComplaint={handleRaiseComplaint}
        isCCE={profiledata?.isCCE}
      />

      {/* ── Reject Inmail EditDialog ── */}
      <InmailRejectDialog
        mail={rejectMail}
        onClose={() => setRejectMail(null)}
        onSuccess={() => {
          setRejectMail(null);
          setPreviewMail(null);
        }}
      />

      {/* ── Close Inmail EditDialog ── */}
      <InmailCloseDialog
        mail={closeMail}
        onClose={() => setCloseMail(null)}
        onSuccess={() => {
          setCloseMail(null);
          setPreviewMail(null);
        }}
      />
    </PortalLayout>
  );
}
