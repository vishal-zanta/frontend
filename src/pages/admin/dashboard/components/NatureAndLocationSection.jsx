import React from "react";
import GrievanceNatureChart from "./charts/GrievanceNatureChart";
import LocationWiseComplaintsChart from "./charts/LocationWiseComplaintsChart";

export default function NatureAndLocationSection({ natureData, locationData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GrievanceNatureChart data={natureData} />
      <LocationWiseComplaintsChart data={locationData} />
    </div>
  );
}
