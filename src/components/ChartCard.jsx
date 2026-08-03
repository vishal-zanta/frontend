import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import clsx from "clsx";

export function ChartCard({ title, subtitle, children, actions, className = "" }) {
  return (
    <Card className={`border-border shadow-sm ${className}`}>
      <CardHeader className="p-3 xs:p-4 sm:p-5 pb-2 xs:pb-2 sm:pb-2">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-4">
          <div>
            <CardTitle className="text-xs xs:text-sm sm:text-base font-semibold text-foreground">{title}</CardTitle>
            {subtitle && <p className="text-[10px] xs:text-[11px] sm:text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent className="p-3 xs:p-4 sm:p-5 pt-0 xs:pt-0 sm:pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

export function SectionTitle({ title, subtitle, children, className="" }) {
  return (
    <div className={clsx("flex w-full flex-col sm:flex-row  lg:flex-col xl:flex-row items-start  justify-between gap-2 sm:gap-4 mb-0" ,className)}>
      <div>
        <h2 className="text-base xs:text-lg sm:text-xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs xs:text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}