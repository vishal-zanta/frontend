import React from "react";

export default function ComplaintComplainantSection({
  citizenName,
  mobileNumber,
  emailAddress,
  preferredLanguage,
}) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 border border-border">
      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
        Complainant Details
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground block">Full Name</span>
          <span className="font-semibold text-foreground">{citizenName}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Mobile Number</span>
          {mobileNumber !== "-" ? (
            <a
              href={`tel:${mobileNumber}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {mobileNumber}
            </a>
          ) : (
            <span className="font-semibold text-foreground">-</span>
          )}
        </div>
        <div>
          <span className="text-muted-foreground block">Email Address</span>
          {emailAddress !== "-" ? (
            <a
              href={`mailto:${emailAddress}`}
              className="font-semibold text-blue-600 hover:underline block truncate"
            >
              {emailAddress}
            </a>
          ) : (
            <span className="font-semibold text-foreground">-</span>
          )}
        </div>
        <div>
          <span className="text-muted-foreground block">
            Preferred Language
          </span>
          <span className="font-semibold text-foreground uppercase">
            {preferredLanguage}
          </span>
        </div>
      </div>
    </div>
  );
}
