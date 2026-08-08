import { getExternalComplaints } from "@/api/complaint.api";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { QUERY_KEYS } from "@/utils/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const DepartmentList = ({ selectedDept, onSelect, autoSelect, selected, params={} }) => {
  const { t } = useLanguage();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.EXTERNAL_COMPLAINTS, selectedDept?.key, JSON.stringify(params)],
    queryFn: ({ pageParam = 1 }) =>
      getExternalComplaints({
        ...params,
        departmentCode: selectedDept?.key,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const pagination =
        lastPage?.data?.data?.pagination ||
        lastPage?.data?.pagination ||
        lastPage?.pagination;
      if (!pagination) return undefined;
      const currentPage = pagination.page || pagination.currentPage || 1;
      const totalPages = pagination.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const docs = useMemo(() => {
    return (
      data?.pages?.flatMap(
        (page) =>
          page?.data?.data?.docs || page?.data?.docs || page?.docs || [],
      ) || []
    );
  }, [data]);

  const ListComponent = selectedDept?.listComponent;

  useEffect(() => {
    if (autoSelect && docs.length > 0) {
      const selectedId = selected?._id || selected?.id;
      const isSelectedInList = docs.some((d) => (d._id || d.id) === selectedId);
      if (!selected || !isSelectedInList) {
        onSelect(docs[0]);
      }
    }
  }, [docs, selected, autoSelect, onSelect]);

  return (
    <LoaderErrWrapper isLoading={isLoading} error={error}>
      {docs.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
          {t("No complaints found.", "कोई शिकायत नहीं मिली।")}
        </div>
      ) : (
        <>
          {docs.map((item, index) => {
            if (!ListComponent) return null;
            return (
              <ListComponent
                key={item._id || item.id || index}
                data={item}
                onClick={() => onSelect(item)}
                isSelected={selected?._id === item._id}
              />
            );
          })}

          {hasNextPage && (
            <div className="p-3 bg-muted/10 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full text-xs cursor-pointer"
              >
                {isFetchingNextPage
                  ? t("Loading more...", "और लोड हो रहा है...")
                  : t("Load More", "और लोड करें")}
              </Button>
            </div>
          )}
        </>
      )}
    </LoaderErrWrapper>
  );
};

export default DepartmentList;
