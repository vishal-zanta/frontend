import React from "react";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const Pagination = ({
  page,
  setPage,
  limit,
  setLimit,
  totalPage,
  limitOptions = [10, 20, 50],
  isLoading = false,
}) => {
  React.useEffect(() => {
    if (!isLoading) {
      if (page > 1 && totalPage > 0 && page > totalPage) {
        setPage(totalPage);
      } else if (page > 1 && totalPage === 0) {
        setPage(1);
      }
    }
  }, [page, totalPage, isLoading, setPage]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPage <= maxVisible) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPage - 1, page + 1);

      if (start > 2) {
        pages.push("ellipsis-start");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPage - 1) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPage);
    }
    return pages;
  };

  if (totalPage <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 py-2 px-4 border-t border-border ">
      {/* Rows per page Selector */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-xs">Values per page:</span>
        <Select
          value={String(limit)}
          onValueChange={(val) => {
            setLimit(Number(val));
            setPage(1); // Reset page index to 1 when limit updates
          }}
        >
          <SelectTrigger className="w-[70px] h-8 border-border bg-card">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination Controls */}
      <PaginationUI className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
              className={cn(
                "cursor-pointer select-none text-xs",
                page <= 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {getPageNumbers().map((p, idx) => {
            if (p === "ellipsis-start" || p === "ellipsis-end") {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={page === p}
                  onClick={() => setPage(p)}
                  className="cursor-pointer select-none"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPage && setPage(page + 1)}
              className={cn(
                "cursor-pointer select-none text-xs",
                page >= totalPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationUI>
    </div>
  );
};

export default Pagination;