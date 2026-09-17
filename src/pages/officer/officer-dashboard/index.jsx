import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { OfficerId } from "@/components/ComplaintDetailDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/context/AuthContext";
import { getEntityLabel } from "@/utils/helpers";

export default function OfficerDashboard() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const assignedServices =
    profile?.officerTagging?.services ||
    profile?.services ||
    [];

  const {
    data: analyticsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGetDashboardData();

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

  return (
    <PortalLayout role="officer">
      <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
        <WelcomeComponent analyticsData={analyticsData} />

        <StatsCards
          analyticsData={analyticsData}
          isLoading={statsLoading}
          error={statsError}
        />

        {/* Department / Services */}
        <div className="bg-card rounded-xl border border-border p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2 gap-2">
            <h3 className="font-bold text-foreground text-xs lg:text-sm">
              {t("Department & Services Assigned", "सौंपे गए विभाग और सेवाएं")}
            </h3>
            <span className="text-[10px] lg:text-xs text-muted-foreground shrink-0">
              {t("Officer ID:", "अधिकारी आईडी:")}{" "}
              <OfficerId id={profile?.userCode || "-"} />
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 lg:gap-2">
            {assignedServices.length > 0 ? (
              assignedServices.map((s, idx) => {
                const serviceName =
                  getEntityLabel(s, t) ||
                  s?.title ||
                  s?.name ||
                  (typeof s === "string" ? s : "-");
                const deptName =
                  getEntityLabel(s?.department, t) ||
                  s?.department?.title ||
                  s?.department?.name ||
                  "";
                return (
                  <Badge
                    key={s._id || s.id || idx}
                    variant="outline"
                    className="text-[10px] lg:text-xs bg-primary/10 text-primary"
                  >
                    {serviceName}
                    {deptName ? ` - ${deptName}` : ""}
                  </Badge>
                );
              })
            ) : (
              <span className="text-xs lg:text-sm text-muted-foreground">
                {t("No services assigned", "कोई सेवा सौंपी नहीं गई")}
              </span>
            )}
          </div>
        </div>

        {/* Assigned Complaints Table */}
        <AssignedComplaintsTable />

        {/* Field Visits Table */}
        <div className="bg-card rounded-xl border border-border">
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
            <div>
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
