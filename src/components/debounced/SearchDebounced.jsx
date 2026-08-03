import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  isClearable = true,
 onFocus
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

  useEffect(() => {
    if (
      !!initialValue &&
      !!initialValue.trim() &&
      searchQuery !== initialValue
    ) {
      setSearchQuery(initialValue);
    }
  }, [initialValue]);



  return (
    <div className={clsx("relative", className)}>
      {icon && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
      )}
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          icon && "pl-8 sm:pl-9",
          isClearable && searchQuery && "pr-7 sm:pr-8",
          inputClassName,
        )}
        {...inputProps}
      />
      {isClearable && searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            handleDebouncedChange("");
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchDebounced;
