import React from "react";

const WorkflowFilter = ({ filterOptions = [], filter = {}, setFilter }) => {
  const handleChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex gap-2 items-center">
      {filterOptions.map((fOpt) => {
        const activeValue = filter[fOpt.filterKey] || "";
        return (
          <div key={fOpt.filterKey} className="flex items-center gap-1.5">
            {fOpt.label && (
              <label className="text-xs font-semibold text-muted-foreground">
                {fOpt.label}:
              </label>
            )}
            <select
              value={activeValue}
              onChange={(e) => handleChange(fOpt.filterKey, e.target.value)}
              className="text-xs h-8 rounded-md border border-input bg-white px-2.5 py-1 font-medium text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-[#F4F7FA]"
            >
              {fOpt.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowFilter;
