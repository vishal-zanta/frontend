import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function RhfBoolean({
  name,
  label,
  description,
  className,
  labelClassName,
  disabled = false,
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col gap-1", className)}>
          <label
            htmlFor={name}
            className={cn(
              "flex items-center gap-2.5 cursor-pointer",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <input
              id={name}
              type="checkbox"
              disabled={disabled}
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              className="w-4 h-4 rounded accent-primary border border-border"
            />
            {label && (
              <Label
                htmlFor={name}
                className={cn(
                  "font-normal text-sm text-foreground cursor-pointer select-none",
                  labelClassName,
                )}
              >
                {label}
              </Label>
            )}
          </label>

          {description && (
            <p className="text-xs text-muted-foreground pl-6">{description}</p>
          )}

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
