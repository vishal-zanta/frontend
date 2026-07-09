import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

const SelectDebounced = ({
  initialValue,
  handleDebouncedChange,
  handleInstantChange,
  delay = 1000,
  className = "",
  selectTriggerClassName = "",
  placeholder = "Select options...",
  options = [], // array of objects { label, value }
  selectProps = {},
  isAll=false,
  allLabel="All",
}) => {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef(null);

  useEffect(() => {
   !!initialValue &&  setValue(initialValue);
  }, [options, initialValue]);

  useEffect(() => {
    handleInstantChange && handleInstantChange(value);
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebouncedChange && handleDebouncedChange(value);
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value]);

  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={(val) => setValue(val)}
        {...selectProps}
      >
        <SelectTrigger className={clsx("w-48 text-sm", selectTriggerClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            {isAll &&   <SelectItem
              key={""}
              value={null}
              className="text-sm"
            >
              {allLabel}
            </SelectItem>}
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={String(opt.value)}
              className="text-sm"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDebounced;