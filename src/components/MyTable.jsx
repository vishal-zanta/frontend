import clsx from "clsx";
import React from "react";

const MyTable = ({
  tableHeaders = [],
  tableBody = [],
  pagination = null,
  tableClassName = "",
}) => {
  return (
    <div className={clsx(" overflow-hidden", tableClassName)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              {tableHeaders.map((h) => (
                <th
                  key={h.id}
                  className={clsx("px-4 py-2 font-medium", h.className)}
                >
                  {h.label}
                </th>
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

export default MyTable;
