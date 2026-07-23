import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Loader, Loader2 } from "lucide-react";

const buildStyles = (hasError, disabled, colors, isMulti) => ({
  control: (provided, state) => ({
    ...provided,
    borderColor: hasError
      ? "hsl(var(--destructive))"
      : state.isFocused
      ? "hsl(var(--ring))"
      : "hsl(var(--border))",
    boxShadow: state.isFocused
      ? hasError
        ? "0 0 0 1px hsl(var(--destructive))"
        : "0 0 0 1px hsl(var(--ring))"
      : "none",
    borderRadius: "var(--radius)",
    minHeight: "36px",
    backgroundColor: disabled ? "hsl(var(--muted))" : "hsl(var(--card))",
    cursor: disabled ? "not-allowed" : "default",
    "&:hover": {
      borderColor: hasError
        ? "hsl(var(--destructive))"
        : state.isFocused
        ? "hsl(var(--ring))"
        : "hsl(var(--border))",
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
    backgroundColor: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    color: "hsl(var(--popover-foreground))",
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
    backgroundColor: "hsl(var(--popover))",
    color: "hsl(var(--popover-foreground))",
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
      : "hsl(var(--popover-foreground))",
    cursor: "pointer",
    fontSize: "0.875rem",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    },
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
    color: "hsl(var(--secondary-foreground))",
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
    fontSize: "0.875rem",
    color: "hsl(var(--foreground))",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    },
  }),
  input: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "hsl(var(--foreground))",
    margin: 0,
    padding: 0,
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    position: "absolute",
    fontSize: "0.875rem",
    color: colors?.placeholder ?? "hsl(var(--muted-foreground))",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "34px",
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
    color: "hsl(var(--muted-foreground))",
    "&:hover": {
      color: "hsl(var(--foreground))",
    },
  }),
});

export default function RhfSelect({
  name,
  label,
  placeholder,
  options = [],
  className,
  labelClassName,
  required = false,
  disabled = false,
  isMultiple = false,
  isCreatable = false,
  isLoading=false,
  colors,
}) {
  const { control } = useFormContext();
  const themeContext = useTheme();
  const _theme = themeContext?.theme; // Subscribe to ThemeContext so component re-renders on theme change

  // isCreatable always implies multiple
  const isMulti = !!isMultiple;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const styles = buildStyles(!!error, disabled, colors, isMulti);

        const selectOptions =
          isMulti && options.length > 0
            ? [{ label: "Select All", value: "SELECT_ALL" }, ...options]
            : options;

        const toOption = (val) =>
          options.find((o) => o.value === val) ?? { label: val, value: val };

        const selectValue = isMulti
          ? Array.isArray(field.value)
            ? field.value.map(toOption)
            : []
          : field.value
          ? toOption(field.value)
          : null;

        const handleChange = (selected) => {
          if (isMulti) {
            const arr = selected ?? [];
            const selectedValues = arr.map((o) => o.value);
            if (selectedValues.includes("SELECT_ALL")) {
              const allValues = options.map((o) => o.value);
              const previouslySelectedCount = (field.value ?? []).length;
              if (previouslySelectedCount === allValues.length) {
                field.onChange([]);
              } else {
                field.onChange(allValues);
              }
            } else {
              field.onChange(selectedValues);
            }
          } else {
            field.onChange(selected?.value ?? "");
          }
        };

        const commonProps = {
          ref: field.ref,
          inputId: name,
          options: selectOptions,
          placeholder: placeholder ?? label ?? "Select...",
          isDisabled: disabled,
          isLoading: isLoading,
          isMulti: isMulti,
          isClearable: true,
          isSearchable: true,
          value: selectValue,
          onChange: handleChange,
          onBlur: field.onBlur,
          styles,

          // Portal the menu into <body> so it escapes dialog/overflow contexts
          menuPortalTarget:
            typeof document !== "undefined" ? document.body : undefined,

          menuPosition: "fixed",
          menuPlacement: "auto",
          classNamePrefix: "rhf-select",
          theme: (reactSelectTheme) => ({
            ...reactSelectTheme,
            colors: {
              ...reactSelectTheme.colors,
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
                htmlFor={name}
                className={cn(
                  "font-normal text-sm md:text-sm text-foreground mb-0.5",
                  labelClassName,
                )}
              >
                {label}
                {required && <span className="text-destructive"> *</span>}
              </Label>
            )}
            {isLoading ? <Loader2 className="animate-spin" /> : (

           <>

            {isCreatable ? (
              <CreatableSelect
                {...commonProps}
                isMulti={isMultiple}
                createOptionPosition="last"
                isValidNewOption={(inputValue) => inputValue.trim().length > 0}
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                value={selectValue}
                onChange={handleChange}
              />
            ) : (
              <ReactSelect {...commonProps}  />
            )}
            </>
 )}
            {error && (
              <span className="text-destructive text-xs font-medium">
                {error.message}
              </span>
            )}

          </div>
        );
      }}
    />
  );
}
