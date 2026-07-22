import clsx from "clsx";
import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const MyTable = ({
  tableHeaders = [],
  tableBody = [],
  pagination = null,
  tableClassName = "",
  sortProps = null,
}) => {
  return (
    <div className={clsx(" overflow-hidden", tableClassName)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              {tableHeaders.map((h) => (
                <SortHeader h={h} sortProps={sortProps} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tableBody.map((tb, bIdex) => {
              return (
                <tr key={bIdex} className="hover:bg-muted/30">
                  {tableHeaders.map((h, hIdex) => {
                    const currCell = tb[h.id];
                    return (
                      <td
                        key={`${h.id}-${hIdex}-${bIdex}`}
                        className={clsx(
                          "px-4 py-3 text-sm",
                          currCell?.className,
                        )}
                      >
                        {currCell?.render ? (
                          <currCell.render />
                        ) : (
                          currCell?.value || "-"
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination ? pagination : null}
    </div>
  );
};

const SortHeader = ({ h, sortProps }) => {
  const headerKey = h.key || h.id;
  const isSorted = sortProps && sortProps.sortBy === headerKey;
  const isSortable = h.isSortable && sortProps;

  const handleSort = () => {
    if (!isSortable || !sortProps) return;
    if (sortProps.sortBy !== headerKey) {
      sortProps.setSortBy(headerKey);
      sortProps.setSortOrder("asc");
    } else {
      if (sortProps.sortOrder === "asc") {
        sortProps.setSortOrder("desc");
      } else {
        sortProps.setSortBy("");
        sortProps.setSortOrder("");
      }
    }
  };

  const renderIcon = () => {
    if (!isSortable || !sortProps) return null;
    if (!isSorted || !sortProps.sortOrder) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-muted-foreground/50 shrink-0" />;
    }
    if (sortProps.sortOrder === "asc") {
      return <ArrowUp className="w-3.5 h-3.5 ml-1 text-primary shrink-0" />;
    }
    if (sortProps.sortOrder === "desc") {
      return <ArrowDown className="w-3.5 h-3.5 ml-1 text-primary shrink-0" />;
    }
    return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-muted-foreground/50 shrink-0" />;
  };

  return (
    <th
      key={h.id}
      onClick={handleSort}
      className={clsx(
        "px-4 py-2 font-medium",
        h.className,
        isSortable && "cursor-pointer select-none hover:bg-muted/40 transition-colors"
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-1",
          h.className?.includes("text-center") && "justify-center",
          h.className?.includes("text-right") && "justify-end"
        )}
      >
        <span>{h.label}</span>
        {renderIcon()}
      </div>
    </th>
  );
};

export default MyTable;
