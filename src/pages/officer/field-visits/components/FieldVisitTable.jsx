import React from "react";
import { MapPin, Camera, Calendar, Pencil } from "lucide-react";
import { FieldVisitId, ComplaintId } from "@/components/ComplaintDetailDialog";
import { PriorityBadge } from "@/components/Badges";
import { Badge } from "@/components/ui/badge";
import { getFieldVisitStatusClass, IMG_BASE_URL } from "@/utils/constants";

export default function FieldVisitTable({ filtered = [], onEdit, onView , isHideAction = false}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-medium">Visit ID</th>
            <th className="px-4 py-3 font-medium">Complaint ID</th>
            <th className="px-4 py-3 font-medium text-nowrap">Date of Complaint</th>
            <th className="px-4 py-3 font-medium text-nowrap">Scheduled Visit</th>

            <th className="px-4 py-3 font-medium min-w-40">Service</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Scheduled</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium min-w-32 text-center">Geo-Tag</th>
            <th className="px-4 py-3 font-medium">Photo</th>
            <th className="px-4 py-3 font-medium">Status</th>
           {!isHideAction &&  <th className="px-4 py-3 font-medium text-center sticky right-0 bg-[#F4F7FA]">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map((fv, i) => {
            const dateVal = fv.schedule || fv.scheduledDate;
            const scheduledDateVal = dateVal
              ? new Date(dateVal).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  })
              : "-";

            return (
              <tr key={fv._id || i} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <FieldVisitId id={fv.visitId || fv._id || "-"} visit={fv} />
                </td>
                <td className="px-4 py-3">
                  {fv.grievance?._id ? (
                    <ComplaintId id={fv.grievance._id} complaint={fv.grievance} />
                  ) : (
                    "-"
                  )}
                </td>
                 <td className="px-4 py-3 text-nowrap">
                  {new Date(fv.grievance?.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                 <td className="px-4 py-3 text-nowrap">
                {fv?.schedule ?   <>
                  {new Date(fv?.schedule).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  </> : "-"}
                </td>
                

                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {fv.serviceDetails?.title || "-"}
                  {fv.subServiceDetails?.title && (
                    <div className="text-[10px] text-muted-foreground">
                      {fv.subServiceDetails.title}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {fv?.grievance?.address?.state || fv?.grievance?.address?.district ? (
                    <>
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {fv?.grievance?.address?.district?.name || "-"},{" "}
                      {fv?.grievance?.address?.state || "-"}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {scheduledDateVal}
                </td>
                <td className="px-4 py-3">
                  {fv.grievance?.assignedPriority ? (
                    <PriorityBadge priority={fv.grievance.assignedPriority} />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground text-nowrap">
                  {(() => {
                    const coords = fv.grievance?.geotaggedImages?.[0]?.coordinates;
                    return coords?.latitude && coords?.longitude
                      ? `${String(coords.latitude).slice(0, 7)} | ${String(coords.longitude).slice(0, 7)}`
                      : "-";
                  })()}
                </td>
                <td className="px-4 py-3">
                  {fv.grievance?.geotaggedImages && fv.grievance.geotaggedImages.length > 0 ? (
                    (() => {
                      const img = fv.grievance.geotaggedImages[0];
                      const url = typeof img === "string" ? img : (img?.url || img?.path || "");
                      const displayUrl = url.startsWith("http") ? url : (IMG_BASE_URL + url);
                      return (
                        <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 inline-block">
                          <Camera className="w-4 h-4 text-emerald-500" />
                        </a>
                      );
                    })()
                  ) : (
                    <span>-</span>
                  )}
                  
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getFieldVisitStatusClass(fv.status)}`}
                  >
                    {fv.status || "-"}
                  </Badge>
                </td>
               {!isHideAction &&  <td className="px-4 py-3 text-center sticky right-0 bg-[#fff]">
                  <div className="flex gap-2 justify-center">
                    
                    <button
                      onClick={() => onEdit && onEdit(fv)}
                      className="p-1.5 hover:bg-muted rounded text-muted-foreground cursor-pointer"
                      title="Edit Visit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </td>}
              </tr>
            );
          })}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No field visits match your filters.
        </div>
      )}
    </div>
  );
}
