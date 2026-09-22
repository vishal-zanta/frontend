import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Translate from "@/components/Translate";

export default function RhfTextarea({
  name,
  label,
  placeholder,
  className,
  labelClassName,
  inputClassName,
  required = false,
  disabled = false,
  rows = 4,
  isShowTranslate = true,
  ...props
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col gap-1.5", className)}>
          {label && (
            <Label
              htmlFor={name}
              className={cn(
                "font-normal text-sm md:text-sm text-foreground mb-0.5 w-fit",
                labelClassName,
              )}
            >
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}
          <div className="relative">
            <Textarea
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(
                error && "border-destructive focus-visible:ring-destructive",
                isShowTranslate && "pr-10",
                inputClassName,
              )}
              {...field}
              {...props}
            />
            {isShowTranslate && (
              <div className="absolute top-2.5 right-3 flex items-center text-muted-foreground hover:text-foreground">
                <Translate
                  name={name}
                  control={control}
                  onTranslateDone={(translatedText) => {
                    if (translatedText) {
                      field.onChange(translatedText);
                    }
                  }}
                />
              </div>
            )}
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

