import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navigation,
} from "lucide-react";
import {
  COMPLAINTS,
  OFFICERS,
  DISTRICT_WISE,
  SERVICES,
} from "@/lib/biharData";
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

const officerProfiles = {
  l1: { officer: OFFICERS[0], label: "L1 Field Officer" },
  l2: { officer: OFFICERS[3], label: "L2 Supervisory Officer" },
  zone: { officer: OFFICERS[6], label: "Zone Administrator" },
  division: { officer: OFFICERS[6], label: "Divisional Administrator" },
  suda: { officer: OFFICERS[8], label: "SUDA Administrator" },
};

export default function OfficerDashboard() {
  const [profileId] = usePortalProfile("officer");
  const profile = officerProfiles[profileId] || officerProfiles.l1;
  const officer = profile.officer;
  const [search, setSearch] = useState("");

  const myComplaints = COMPLAINTS.filter(
    (c) => c.l1Officer === officer.id || c.l2Officer === officer.id,
  );
  const { page: visitPage, limit: visitLimit, ...visitPageProps } = usePagination(1);
  const { data: visitsApiData, isLoading: visitsLoading, error: visitsError } = useGetFieldVisits({
    page: visitPage,
    limit: visitLimit,
  });
  const fieldVisits = visitsApiData?.data?.data?.docs || [];
  const totalVisitPages = visitsApiData?.data?.data?.pagination?.totalPages ?? 1;
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
        <div className="p-6 space-y-6">
          <WelcomeComponent
            officer={officer}
            profileId={profileId}
            profileLabel={profile.label}
          />

          <StatsCards
            profileId={profileId}
            officer={officer}
          />

          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="font-bold text-foreground">
                District-wise Complaint Status
              </h3>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">District</th>
                    <th className="px-4 py-2 font-medium text-right">Total</th>
                    <th className="px-4 py-2 font-medium text-right">
                      Resolved
                    </th>
                    <th className="px-4 py-2 font-medium text-right">
                      Pending
                    </th>
                    <th className="px-4 py-2 font-medium text-right">
                      Escalated
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
      <div className="p-6 space-y-6">
        <WelcomeComponent
          officer={officer}
          profileId={profileId}
          profileLabel={profile.label}
        />

        <StatsCards
          profileId={profileId}
          officer={officer}
        />

        {/* Department / Services */}
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground text-sm">
              Department & Services Assigned
            </h3>
            <span className="text-xs text-muted-foreground">
              Officer ID: <OfficerId id={officer.id} />
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {officer.services.length > 0 ? (
              officer.services.map((sId) => {
                const svc = SERVICES.find((s) => s.id === sId);
                return (
                  <Badge
                    key={sId}
                    variant="outline"
                    className="text-xs bg-blue-50 text-primary"
                  >
                    {svc?.name || sId}
                    {svc ? ` - ${svc.dept}` : ""}
                  </Badge>
                );
              })
            ) : (
              <span className="text-sm text-muted-foreground">
                All services (admin level)
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
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Field Visits
            </h3>
            <Link to="/officer/field-visits">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <LoaderErrWrapper isLoading={visitsLoading} error={visitsError}>
            <FieldVisitTable
              filtered={fieldVisits}
              isHideAction={true}
            />
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

        <QuickActions officer={officer} />
      </div>
    </PortalLayout>
  );
}
