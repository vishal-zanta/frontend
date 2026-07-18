import React from "react";

export default function ComplaintLocationSection({
  addressVillageOrWard,
  addressSubdivision,
  addressDistrict,
  addressState,
  addressLandmark,
  addressPinCode,
}) {

  return (
    <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border">
      <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider mb-2">Location &amp; Address</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs">
        <div>
          <span className="text-muted-foreground block">Village / Ward</span>
          <span className="font-semibold text-foreground">{addressVillageOrWard}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Subdivision</span>
          <span className="font-semibold text-foreground">{addressSubdivision}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">District</span>
          <span className="font-semibold text-foreground">{addressDistrict}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">State</span>
          <span className="font-semibold text-foreground">{addressState}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Landmark</span>
          <span className="font-semibold text-foreground">{addressLandmark}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Pin Code</span>
          <span className="font-semibold text-foreground">{addressPinCode}</span>
        </div>
      </div>
    </div>
  );
}
