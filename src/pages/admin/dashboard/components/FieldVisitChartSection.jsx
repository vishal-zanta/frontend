import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Calendar, MapPin } from "lucide-react";
import { useGetVisitLineGraph, useGetVisitsByDate } from "../query";
import { ChartCard } from "@/components/ChartCard";
import { LineChartCard } from "@/components/Charts";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { useLanguage } from "@/context/LanguageContext";
import { getDateInfo } from "@/utils/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FieldVisitTable from "@/pages/officer/field-visits/components/FieldVisitTable";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";

const FieldVisitChartSection = ({ period, dateRange }) => {
  const { t } = useLanguage();
  const [openFvDateDialog, setOpenFvDateDialog] = useState(null);

  const dateInfo = getDateInfo({ period, dateRange });

  const params = {
    ...(dateInfo?.fromDate && { startDate: dateInfo.fromDate }),
    ...(dateInfo?.toDate && { endDate: dateInfo.toDate }),
  };

  const { data, isLoading, error, isFetching } = useGetVisitLineGraph(params);
  const timeline = data?.data?.data?.timeline || [];

  const chartData = useMemo(() => {
    if (!Array.isArray(timeline)) return [];
    return timeline.map((item) => {
      const m = moment(item.date);
      return {
        ...item,
        label: m.isValid() ? m.format("DD MMM") : item.date || "",
        count:
          typeof item.count === "number" ? item.count : Number(item.count) || 0,
      };
    });
  }, [timeline]);

  const totalVisits = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (curr.count || 0), 0);
  }, [chartData]);

  return (
    <>
      <ChartCard
        title={t("Field Visits Trend", "फील्ड विजिट रुझान")}
        subtitle={t(
          "Daily field visits conducted over the selected period",
          "चयनित अवधि में आयोजित दैनिक फील्ड विजिट",
        )}
        actions={
          !isLoading && chartData.length > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-900">
              <span>{t("Total Visits:", "कुल विजिट:")}</span>
              <span className="font-bold text-sm">
                {totalVisits.toLocaleString()}
              </span>
            </div>
          ) : null
        }
      >
        <LoaderErrWrapper isLoading={isLoading || isFetching} error={error}>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
              {t(
                "No field visit data available for the selected period",
                "चयनित अवधि के लिए कोई फील्ड विजिट डेटा उपलब्ध नहीं है",
              )}
            </div>
          ) : (
            <LineChartCard
              data={chartData}
              xKey="label"
              lines={[
                {
                  key: "count",
                  label: t("Field Visits", "फील्ड विजिट"),
                  color: "#2563eb",
                },
              ]}
              height={300}
              onLineClick={(line) => {
                line?.count && setOpenFvDateDialog(line?.date);
              }}
            />
          )}
        </LoaderErrWrapper>
      </ChartCard>

      {/* Dialog for Field Visits by Date */}
      <FieldVisitsByDateDialog
        open={Boolean(openFvDateDialog)}
        setOpen={(val) => {
          if (!val) setOpenFvDateDialog(null);
        }}
        date={openFvDateDialog}
      />
    </>
  );
};

const FieldVisitsByDateDialog = ({ open, setOpen, date }) => {
  const { t } = useLanguage();
  const { page, limit, setPage, setLimit, limitOptions } = usePagination(1, [
    10, 20, 50,
  ]);

  useEffect(() => {
    if (open) {
      setPage(1);
    }
  }, [open, date, setPage]);

  const { data, isLoading, error } = useGetVisitsByDate(
    { date, page, limit },
    { enabled: Boolean(date && open) },
  );

  const formattedDate =
    date && moment(date).isValid()
      ? moment(date).format("DD MMMM YYYY")
      : date || "";
  const docs = data?.data?.data?.docs;
  const pagination = data?.data?.data?.pagination;
  const totalPage =
    pagination?.totalPages || pagination?.totalPage || pagination?.pages || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] overflow-y-auto p-0 border border-border bg-card  gap-0">
        <DialogHeader className="pb-3 border-b border-border px-4 sm:px-6 py-3 bg-muted/30">
          <DialogTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {t("Field Visits on", "फील्ड विजिट -")} {formattedDate}
          </DialogTitle>
        </DialogHeader>

        <div className="  w-full overflow-x-scroll">
          <LoaderErrWrapper isLoading={isLoading} error={error}>
            <div className="text-sm text-muted-foreground  w-full">
              {/* Data logged to console */}
              {/* {t("Field visit details for", "फील्ड विजिट विवरण:")} {formattedDate} */}
              <FieldVisitTable
                filtered={docs}
                isHideAction
                onVisitClick={() => {}}
                isShowAssignedOfficer
              />
            </div>
          </LoaderErrWrapper>
        </div>
        <div className=" pt-0 mt-0 pb-4">
          <Pagination
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPage={totalPage}
            limitOptions={limitOptions}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldVisitChartSection;
