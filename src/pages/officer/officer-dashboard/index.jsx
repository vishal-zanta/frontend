import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "lucide-react";
import { COMPLAINTS, OFFICERS, DISTRICT_WISE, SERVICES } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { OfficerId } from "@/components/ComplaintDetailDialog";
import { usePortalProfile } from "@/hooks/usePortalProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuickActions from "@/components/officer/QuickActions";
import AssignedComplaintsTable from "./components/AssignedComplaintsTable";
import { useGetFieldVisits } from "@/hooks/query/useGetFieldVisits";
import FieldVisitTable from "../field-visits/components/FieldVisitTable";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import WelcomeComponent from "./components/WelcomeComponent";
import StatsCards from "./components/StatsCards";
import { useGetDashboardData } from "./query";
import { useLanguage } from "@/context/LanguageContext";

const officerProfiles = {
  l1: { officer: OFFICERS[0], label: "L1 Field Officer" },
  l2: { officer: OFFICERS[3], label: "L2 Supervisory Officer" },
  zone: { officer: OFFICERS[6], label: "Zone Administrator" },
  division: { officer: OFFICERS[6], label: "Divisional Administrator" },
  suda: { officer: OFFICERS[8], label: "SUDA Administrator" },
};

export default function OfficerDashboard() {
  const { t } = useLanguage();
  const [profileId] = usePortalProfile("officer");
  const profile = officerProfiles[profileId] || officerProfiles.l1;
  const officer = profile.officer;
  const [search, setSearch] = useState("");

  const {
    data: analyticsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGetDashboardData({ role: profileId });

  const myComplaints = COMPLAINTS.filter(
    (c) => c.l1Officer === officer.id || c.l2Officer === officer.id,
  );
  const {
    page: visitPage,
    limit: visitLimit,
    ...visitPageProps
  } = usePagination(1);
  const {
    data: visitsApiData,
    isLoading: visitsLoading,
    error: visitsError,
  } = useGetFieldVisits({
    page: visitPage,
    limit: visitLimit,
  });
  const fieldVisits = visitsApiData?.data?.data?.docs || [];
  const totalVisitPages =
    visitsApiData?.data?.data?.pagination?.totalPages ?? 1;
  const filtered = search
    ? myComplaints.filter(
        (c) =>
          c.id.toLowerCase().includes(search.toLowerCase()) ||
          c.serviceName.toLowerCase().includes(search.toLowerCase()),
      )
    : myComplaints;

  if (
    profileId === "suda" ||
    profileId === "division" ||
    profileId === "zone"
  ) {
    return (
      <PortalLayout role="officer">
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
          <WelcomeComponent
            officer={officer}
            profileId={profileId}
            profileLabel={profile.label}
          />

          <StatsCards
            officer={officer}
            analyticsData={analyticsData}
            isLoading={statsLoading}
            error={statsError}
          />

          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="font-bold text-foreground">
                {t("District-wise Complaint Status", "जिला-वार शिकायत स्थिति")}
              </h3>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="bg-[#F4F7FA] sticky top-0">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">
                      {t("District", "जिला")}
                    </th>
                    <th className="px-4 py-2 font-medium text-right">
                      {t("Total", "कुल")}
                    </th>
                    <th className="px-4 py-2 font-medium text-right">
                      {t("Resolved", "हल की गई")}
                    </th>
                    <th className="px-4 py-2 font-medium text-right">
                      {t("Pending", "लंबित")}
                    </th>
                    <th className="px-4 py-2 font-medium text-right">
                      {t("Escalated", "बढ़ाया गया")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DISTRICT_WISE.map((d, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium">{d.district}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">
                        {d.total.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2.5 text-right text-emerald-600">
                        {d.resolved.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2.5 text-right text-amber-600">
                        {d.pending}
                      </td>
                      <td className="px-4 py-2.5 text-right text-red-600">
                        {d.escalated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <QuickActions officer={officer} />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="officer">
      <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
        <WelcomeComponent
          officer={officer}
          profileId={profileId}
          profileLabel={profile.label}
        />

        <StatsCards
          officer={officer}
          analyticsData={analyticsData}
          isLoading={statsLoading}
          error={statsError}
        />

        {/* Department / Services */}
        <div className="bg-white rounded-xl border border-border p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2 gap-2">
            <h3 className="font-bold text-foreground text-xs lg:text-sm">
              {t("Department & Services Assigned", "सौंपे गए विभाग और सेवाएं")}
            </h3>
            <span className="text-[10px] lg:text-xs text-muted-foreground shrink-0">
              {t("Officer ID:", "अधिकारी आईडी:")} <OfficerId id={officer.id} />
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 lg:gap-2">
            {officer.services.length > 0 ? (
              officer.services.map((sId) => {
                const svc = SERVICES.find((s) => s.id === sId);
                return (
                  <Badge
                    key={sId}
                    variant="outline"
                    className="text-[10px] lg:text-xs bg-blue-50 text-primary"
                  >
                    {svc?.name || sId}
                    {svc ? ` - ${svc.dept}` : ""}
                  </Badge>
                );
              })
            ) : (
              <span className="text-xs lg:text-sm text-muted-foreground">
                {t("All services (admin level)", "सभी सेवाएं (प्रशासन स्तर)")}
              </span>
            )}
          </div>
        </div>

        {/* Assigned Complaints Table */}
        <AssignedComplaintsTable
          search={search}
          setSearch={setSearch}
          filtered={filtered}
        />

        {/* Field Visits Table */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-3 lg:px-5 py-3 lg:py-4 border-b border-border flex items-center justify-between gap-2">
            <h3 className="font-bold text-foreground text-xs lg:text-sm flex items-center gap-1.5 lg:gap-2">
              <Navigation className="w-3.5 h-3.5 lg:w-4 lg:h-4" />{" "}
              {t("Field Visits", "फील्ड विजिट")}
            </h3>
            <Link to="/officer/field-visits">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 lg:h-9"
              >
                {t("View All", "सभी देखें")}
              </Button>
            </Link>
          </div>
          <LoaderErrWrapper isLoading={visitsLoading} error={visitsError}>
            <FieldVisitTable filtered={fieldVisits} isHideAction={true} />
            <div className="">
              <Pagination
                page={visitPage}
                limit={visitLimit}
                totalPage={totalVisitPages}
                isLoading={visitsLoading}
                {...visitPageProps}
              />
            </div>
          </LoaderErrWrapper>
        </div>
      </div>
    </PortalLayout>
  );
}
