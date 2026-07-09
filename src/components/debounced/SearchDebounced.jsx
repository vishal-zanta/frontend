import { Search } from "lucide-react";
import  { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";

const SearchDebounced = ({
  initialValue = "",
  handleDebouncedChange,
  handleInstantChange,
  delay = 1000,
  className = "",
  inputClassName = "",
  inputProps = {},
  placeholder = "Search by name or email...",
  icon = true,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const timerRef = useRef(null);

  useEffect(() => {
    handleInstantChange && handleInstantChange(searchQuery);
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebouncedChange && handleDebouncedChange(searchQuery);
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [searchQuery]);
  return (
    <div className={clsx("relative", className)}>
      {icon && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      )}
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className={clsx(icon && "pl-9", inputClassName)}
        {...inputProps}
      />
    </div>
  );
};

export default SearchDebounced;
