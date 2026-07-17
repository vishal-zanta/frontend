import React from "react";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const buildStyles = (hasError, disabled, colors, isMulti) => ({
  control: (provided, state) => ({
    ...provided,
    borderColor: hasError
      ? "#ef4444"
      : state.isFocused
      ? "hsl(var(--ring))"
      : "#D7DFEA",
    boxShadow: state.isFocused
      ? hasError
        ? "0 0 0 1px #ef4444"
        : "0 0 0 1px hsl(var(--ring))"
      : "none",
    borderRadius: "var(--radius)",
    minHeight: "36px",
    backgroundColor: disabled ? "#f3f4f6" : "#FFFFFF",
    cursor: disabled ? "not-allowed" : "default",
    "&:hover": {
      borderColor: hasError
        ? "#ef4444"
        : state.isFocused
        ? "hsl(var(--ring))"
        : "#D7DFEA",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "4px 12px",
    minHeight: "34px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    maxHeight: "120px",
    overflowY: isMulti ? "auto" : "hidden",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    width: "100%",
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
    pointerEvents: "auto",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px",
    overflowY: "auto",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "hsl(var(--primary))"
      : state.isFocused
      ? "hsl(var(--accent))"
      : "transparent",
    color: state.isSelected
      ? "hsl(var(--primary-foreground))"
      : state.isFocused
      ? "hsl(var(--accent-foreground))"
      : "#0F1729",
    cursor: "pointer",
    fontSize: "14px",
    padding: "8px 12px",
    "&:active": {
      backgroundColor: "hsl(var(--accent))",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--secondary))",
    borderRadius: "calc(var(--radius) - 2px)",
    fontSize: "13px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#0F1729",
    fontSize: "13px",
    padding: "2px 6px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    padding: "2px",
    borderRadius: "calc(var(--radius) - 2px)",
    "&:hover": {
      backgroundColor: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "14px",
    color: "#0F1729",
  }),
  input: (provided) => ({
    ...provided,
    fontSize: "14px",
    color: "#0F1729",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
    color: colors?.placeholder ?? "hsl(var(--muted-foreground))",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  indicatorsContainer: (provided) => ({
    ...provided,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: "0px 8px",
    color: state.isFocused
      ? "hsl(var(--foreground))"
      : "hsl(var(--muted-foreground))",
    "&:hover": {
      color: "hsl(var(--foreground))",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "0px 8px",
  }),
});

export default function MySelect({
  value,
  onValueChange,
  label,
  placeholder,
  options = [],
  className,
  labelClassName,
  required = false,
  disabled = false,
  isMultiple = false,
  isCreatable = false,
  error,
  colors,
}) {
  const isMulti = isCreatable ? true : isMultiple;
  const styles = buildStyles(!!error, disabled, colors, isMulti);

  const selectOptions = isMulti && options.length > 0
    ? [{ label: "Select All", value: "SELECT_ALL" }, ...options]
    : options;

  const toOption = (val) =>
    selectOptions.find((o) => o.value === val) ?? { label: val, value: val };

  const selectValue = isMulti
    ? Array.isArray(value)
      ? value.map(toOption)
      : []
    : value
    ? toOption(value)
    : null;

  const handleChange = (selected) => {
    if (isMulti) {
      const arr = selected ?? [];
      const selectedValues = arr.map((o) => o.value);
      if (selectedValues.includes("SELECT_ALL")) {
        const allValues = options.map((o) => o.value);
        const previouslySelectedCount = (value ?? []).length;
        if (previouslySelectedCount === allValues.length) {
          onValueChange([]);
        } else {
          onValueChange(allValues);
        }
      } else {
        onValueChange(selectedValues);
      }
    } else {
      onValueChange(selected?.value ?? "");
    }
  };

  const commonProps = {
    options: selectOptions,
    placeholder: placeholder ?? label ?? "Select...",
    isDisabled: disabled,
    isMulti: isMulti,
    isClearable: true,
    isSearchable: true,
    value: selectValue,
    onChange: handleChange,
    styles,
    menuPortalTarget: typeof document !== "undefined" ? document.body : undefined,
    menuPosition: "fixed",
    menuPlacement: "auto",
    classNamePrefix: "my-select",
    theme: (theme) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary: "hsl(var(--ring))",
        primary25: "hsl(var(--accent))",
        primary50: "hsl(var(--accent))",
      },
    }),
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={cn("flex flex-col gap-1.5", className)}
      data-invalid={!!error}
    >
      {label && (
        <Label
          className={cn(
            "font-normal text-sm md:text-sm text-foreground mb-0.5",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}

      {isCreatable ? (
        <CreatableSelect
          {...commonProps}
          isMulti
          createOptionPosition="last"
          isValidNewOption={(inputValue) => inputValue.trim().length > 0}
          formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          value={selectValue}
          onChange={handleChange}
        />
      ) : (
        <ReactSelect {...commonProps} />
      )}

      {error && (
        <span className="text-destructive text-xs font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
