import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HOTSPOTS } from "@/lib/biharData";

const severityColors = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

// Simplified ward polygon for Kankarbagh area (Patna)
const wardPolygon = [
  [25.6150, 85.1200], [25.6200, 85.1250], [25.6220, 85.1350],
  [25.6180, 85.1450], [25.6120, 85.1430], [25.6080, 85.1300],
];

export default function ComplaintMap({ height = 320, showHotspots = true, highlightWard = false, center = [25.61, 85.13], zoom = 12 }) {
  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border border-border relative z-0">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", zIndex: 0 }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        {highlightWard && (
          <Polygon positions={wardPolygon} pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 0.2, weight: 2 }}>
            <Popup>Patna Ward-12 (Highlighted from KML Master Data)</Popup>
          </Polygon>
        )}
        {showHotspots && HOTSPOTS.map((h, i) => (
          <CircleMarker
            key={i}
            center={[h.lat, h.lng]}
            radius={Math.max(6, Math.min(h.complaints / 15, 20))}
            pathOptions={{ color: severityColors[h.severity], fillColor: severityColors[h.severity], fillOpacity: 0.5, weight: 2 }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{h.ward}</strong><br/>
                District: {h.district}<br/>
                Complaints: {h.complaints}<br/>
                Category: {h.category}<br/>
                Severity: {h.severity}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}