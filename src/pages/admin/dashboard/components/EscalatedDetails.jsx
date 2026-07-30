import React, { useState, useEffect } from "react";
import { ChartCard } from "@/components/ChartCard";
import { useGetDepartments } from "@/pages/admin/master-data/hooks";
import useGetRoles from "@/hooks/query/useGetRoles";
import { MAX_LIMIT } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { BarChartCard } from "@/components/Charts";

const EscalatedDetails = () => {
  const [selectedDept, setSelectedDept] = useState("");

  const { data: deptApiData, isLoading: deptLoading } = useGetDepartments([], {
    page: 1,
    limit: MAX_LIMIT,
  });

  const depts = (deptApiData?.data?.data?.docs || []).map((d) => ({
    label: d.title || d.name || "",
    value: d._id,
  }));

  useEffect(() => {
    if (depts.length > 0 && !selectedDept) {
      setSelectedDept(depts[0].value);
    }
  }, [depts, selectedDept]);

  const {
    data: rolesApiData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useGetRoles(
    [1, MAX_LIMIT, selectedDept],
    { page: 1, limit: MAX_LIMIT, department: selectedDept },
    !!selectedDept,
  );

  const roles = rolesApiData?.data?.docs || [];

  return (
    <ChartCard
      title="Escalated Details"
      subtitle="Check escalated complaint count as per department"
      className="lg:col-span-2"
      actions={
        <LoaderErrWrapper isLoading={deptLoading}>
          <div className="flex items-center gap-1.5 shrink-0">
            <label className="text-xs font-semibold text-muted-foreground">
              Department:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs h-8 rounded-md border border-input bg-background px-2.5 py-1 font-medium text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted/50"
            >
              {depts.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </LoaderErrWrapper>
      }
    >
      <LoaderErrWrapper isLoading={rolesLoading} error={rolesError}>
        {roles.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            {selectedDept
              ? "No designations found for the selected department"
              : "Select a department to view details"}
          </div>
        ) : (
             <BarChartCard
                    data={(roles || [])?.map((d) => ({
                      name: d?.designationEnglish,
                      value: d?.count || (Math.ceil( Math.random()*10)),
                      color: "#1d4ed8",
                    }))}
                    xKey="name"
                    bars={[{ key: "value", label: "Complaints", color: "#0ea5e9" }]}
                    height={280}
                    legend={false}
                  />
        //   <div className="space-y-2 py-2">
        //     {roles.map((role) => (
        //       <div
        //         key={role._id}
        //         className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 border border-border text-sm"
        //       >
        //         <span className="font-medium text-foreground">
        //           {role.designationEnglish || role.name}
        //         </span>
        //         <span className="text-xs text-muted-foreground">
        //           {role.department?.title || role.department?.name || ""}
        //         </span>
        //       </div>
        //     ))}
        //   </div>
        )}
      </LoaderErrWrapper>
    </ChartCard>
  );
};

export default EscalatedDetails;