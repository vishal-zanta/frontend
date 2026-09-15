import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function RhfBadgeSelect({
  name,
  label,
  options = [],
  className,
  labelClassName,
  disabled = false,
  required = false,
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col gap-2", className)}>
          {label && (
            <Label
              className={cn(
                "text-sm font-medium text-foreground",
                labelClassName,
              )}
            >
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}

          <div className="flex gap-2">
            {options.map((option) => {
              const isSelected = field.value === option.value;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm border transition-all cursor-pointer select-none",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary font-medium"
                      : "bg-card text-foreground border-border hover:bg-muted font-normal",
                    disabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {error && (
            <span className="text-destructive text-xs font-medium">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
