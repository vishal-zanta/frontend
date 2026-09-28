import React, { useState } from "react";
import { SectionTitle } from "@/components/ChartCard";
import PortalLayout from "@/components/PortalLayout";
import { useLanguage } from "@/context/LanguageContext";
import usePagination from "@/hooks/usePagination";
import { useGetChats } from "@/hooks/query/useGetChats";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import moment from "moment";
import ChatHistoryTable from "./components/ChatHistoryTable";

const ChatHistory = () => {
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState(undefined);
//   console.log({dateRange})
  const [period, setPeriod] = useState("weekly");
  const { page, limit, setPage, setLimit, limitOptions } = usePagination(1, [10, 20, 50, 100]);

  const startDate = dateRange?.from
    ? moment(dateRange.from).startOf("day").toISOString()
    : undefined;
  const endDate = dateRange?.to
    ? moment(dateRange.to).endOf("day").toISOString()
    : dateRange?.from
    ? moment(dateRange.from).endOf("day").toISOString()
    : undefined;

  const { data, isLoading, error } = useGetChats(
    [page, limit, startDate, endDate],
    { page, limit, fromDate : startDate ,toData: endDate }
  );
  const docs = data?.data?.data?.docs || [];
  const pagination = data?.data?.data?.pagination;

  return (
    <PortalLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={t("Chat History", "चैट इतिहास")}
          subtitle={t(
            "View and monitor messages sent across the platform",
            "प्लेटफ़ॉर्म पर भेजे गए संदेशों को देखें और निगरानी करें"
          )}
        >
          <TimeRangeFilter
            period={period}
            setPeriod={setPeriod}
            dateRange={dateRange}
            setDateRange={setDateRange}
            hidePreSetOptions={true}
          />
        </SectionTitle>

        <ChatHistoryTable
          docs={docs}
          pagination={pagination}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          limitOptions={limitOptions}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </PortalLayout>
  );
};

export default ChatHistory;

