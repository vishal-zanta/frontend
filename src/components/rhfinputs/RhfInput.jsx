import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { isValidNumber } from "@/utils/helpers";

export default function RhfInput({
  name,
  label,
  placeholder,
  type = "text",
  className,
  labelClassName,
  inputClassName,
  required = false,
  disabled = false,
  isNumsOnly = false,

  
  ...props
}) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;
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
                "font-normal text-sm md:text-sm text-foreground mb-0.5",
                labelClassName,
              )}
            >
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}
          <div className="relative">
            <Input
              id={name}
              type={inputType}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                error && "border-destructive focus-visible:ring-destructive",
                type === "password" && "pr-10",
                inputClassName,
              )}
              {...field}
              onChange={(e) => {
                if (isNumsOnly && !isValidNumber(e.target.value)) {
                  return;
                }
                field.onChange(e);
                
              }}
              {...props}
            />
            {type === "password" && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
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
