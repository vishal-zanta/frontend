import React from "react";

export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children,
}) {
  return (
    <div className="w-full flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          {/* <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Icon
              className="w-7 h-7 text-primary-foreground"
              aria-hidden="true"
            />
          </div> */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground capitalize">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1.5 capitalize">{subtitle}</p>
          )}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4 sm:p-6">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
