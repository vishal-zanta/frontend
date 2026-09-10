import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HOTSPOTS } from "@/lib/biharData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import RecentComplaintsSection from "@/pages/admin/dashboard/components/RecentComplaintsSection";

const severityColors = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

// Simplified ward polygon for Kankarbagh area (Patna)
const wardPolygon = [
  [25.615, 85.12],
  [25.62, 85.125],
  [25.622, 85.135],
  [25.618, 85.145],
  [25.612, 85.143],
  [25.608, 85.13],
];

// Bihar State bounding box: [South-West, North-East]
const BIHAR_BOUNDS = [
  [24.0, 83.0], // SW coordinate
  [27.8, 88.6], // NE coordinate
];

export default function ComplaintMap({
  height = 320,
  showHotspots = true,
  highlightWard = false,
  center = [25.65, 85.6],
  zoom = 7,
  minZoom = 7,
  maxBounds = BIHAR_BOUNDS,
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState("");

  const handleMarkerClick = (h) => {
    const place = h?.ward
      ? h.district
        ? `${h.ward}, ${h.district}`
        : h.ward
      : h?.district || "Selected Area";
    setSelectedPlace(place);
    setOpen(true);
  };

  return (
    <>
      <div
        style={{ height }}
        className="rounded-lg overflow-hidden border border-border relative z-0"
      >
        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={minZoom}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
            bounds={BIHAR_BOUNDS}
          />
          {highlightWard && (
            <Polygon
              positions={wardPolygon}
              pathOptions={{
                color: "#1d4ed8",
                fillColor: "#3b82f6",
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>Patna Ward-12 (Highlighted from KML Master Data)</Popup>
            </Polygon>
          )}
          {showHotspots &&
            HOTSPOTS.map((h, i) => (
              <CircleMarker
                key={i}
                center={[h.lat, h.lng]}
                radius={Math.max(6, Math.min(h.complaints / 15, 20))}
                pathOptions={{
                  color: severityColors[h.severity],
                  fillColor: severityColors[h.severity],
                  fillOpacity: 0.5,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => {
                    handleMarkerClick(h);
                  },
                }}
              />
            ))}
        </MapContainer>
      </div>

      <ComplaintByPlaceDialog
        open={open}
        setOpen={setOpen}
        place={selectedPlace}
      />
    </>
  );
}

const ComplaintByPlaceDialog = ({ open, setOpen, place }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] overflow-y-auto p-0 ">
        <DialogHeader className="pb-3 border-b border-border px-4 sm:px-6 py-3 ">
          <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
            Complaints - {place}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 px-4 sm:px-6 pb-4">
          <RecentComplaintsSection />
        </div>
      </DialogContent>
    </Dialog>
  );
};
