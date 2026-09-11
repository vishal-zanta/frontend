import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// npm install leaflet react-leaflet

// ------------------------------------------------------------------
// Data sources. Put both files in /public/data/ in your project (they're
// provided alongside this component). No API key needed for either.
//
//   bihar-districts.geojson  — the 38 district polygons, each with a
//                              "district" property to key your data by.
//   bihar-mask.geojson       — a world rectangle with a Bihar-shaped
//                              hole in it. Drawn over the base tiles so
//                              nothing outside Bihar is ever visible.
//
// Don't want to self-host the district file? You can point DISTRICTS_URL
// at a public CDN copy instead:
//   "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/states/bihar.geojson"
// (bigger file, more properties, same "district" key — works as a drop-in,
// just slower to load and not simplified.)
// ------------------------------------------------------------------
const DISTRICTS_URL = "/data/bihar-districts.geojson";
const MASK_URL = "/data/bihar-mask.geojson";

// Sample fallback so the component renders something meaningful before
// you wire up your real API. Replace with your actual complaint counts,
// keyed by district name exactly as it appears in the GeoJSON.
const SAMPLE_DATA = {
  Patna: 380, Gaya: 205, Muzaffarpur: 150, Bhagalpur: 130,
  Darbhanga: 175, Purnia: 120, Begusarai: 95, Nalanda: 90,
};

const BREAKS = [0, 40, 90, 160, 260, 400];
const COLORS = ["#FFF3B0", "#FED976", "#FEB24C", "#FD8D3C", "#E31A1C", "#99000D"];

function getColor(count) {
  for (let i = BREAKS.length - 1; i >= 0; i--) {
    if (count >= BREAKS[i]) return COLORS[i];
  }
  return COLORS[0];
}

function bucketLabel(i) {
  return i === BREAKS.length - 1 ? `${BREAKS[i]}+` : `${BREAKS[i]}\u2013${BREAKS[i + 1] - 1}`;
}

// Fits the map to Bihar on load, then stops the user panning or zooming
// past that extent — this is what actually keeps "only Bihar" on screen.
function LockToBihar({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [10, 10] });
    map.setMaxBounds(bounds.pad(0.1));
    map.setMinZoom(map.getBoundsZoom(bounds));
  }, [bounds, map]);
  return null;
}

export default function BiharComplaintsMap({ complaintsByDistrict }) {
  const [districts, setDistricts] = useState(null);
  const [mask, setMask] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [active, setActive] = useState(null); // { name, count } | null
  const geoJsonRef = useRef(null);

  const data = complaintsByDistrict || SAMPLE_DATA;
  const dataRef = useRef(data);
  dataRef.current = data; // always current inside event handlers below

  useEffect(() => {
    fetch(DISTRICTS_URL)
      .then((r) => r.json())
      .then((gj) => {
        setDistricts(gj);
        setBounds(L.geoJSON(gj).getBounds());
      });
    fetch(MASK_URL).then((r) => r.json()).then(setMask);
  }, []);

  const styleFeature = useCallback(
    (feature) => ({
      fillColor: getColor(data[feature.properties.district] || 0),
      weight: 1,
      color: "#ffffff",
      fillOpacity: 0.82,
    }),
    [data]
  );

  // Re-colour districts whenever complaint counts change, without
  // remounting the whole layer (useful once this is wired to live data).
  useEffect(() => {
    if (geoJsonRef.current) geoJsonRef.current.setStyle(styleFeature);
  }, [styleFeature]);

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.district;
    layer.bindTooltip(name, { sticky: true });
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ weight: 2.5, color: "#1C2321" });
        e.target.bringToFront();
        setActive({ name, count: dataRef.current[name] || 0 });
      },
      mouseout: (e) => geoJsonRef.current && geoJsonRef.current.resetStyle(e.target),
      click: (e) => e.target._map.fitBounds(e.target.getBounds(), { maxZoom: 9 }),
    });
  };

  if (!districts || !mask || !bounds) {
    return <div style={{ padding: 24, fontFamily: "sans-serif" }}>Loading map…</div>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <MapContainer
        center={[25.6, 85.5]}
        zoom={7}
        maxZoom={11}
        zoomControl
        scrollWheelZoom
        style={{ width: "100%", height: "100%", background: "#EAECE8" }}
      >
        <LockToBihar bounds={bounds} />

        {/* Remove this TileLayer entirely if you'd rather show only the
            coloured districts on a blank background — then you can drop
            the mask layer below too, since there's nothing to hide. */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={11}
        />

        <GeoJSON
          data={mask}
          interactive={false}
          style={{ fillColor: "#F3F4F1", fillOpacity: 0.94, stroke: false }}
        />

        <GeoJSON
          ref={geoJsonRef}
          data={districts}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      {/* District info — bottom-left */}
      <div style={panelStyle("left")}>
        <div style={labelStyle}>District</div>
        <div style={{ fontSize: 16, fontWeight: 600, margin: "2px 0" }}>
          {active ? active.name : "\u2014"}
        </div>
        <div style={{ fontSize: 13, color: "#5B6B73" }}>
          {active ? `${active.count} complaints` : "Hover over the map"}
        </div>
      </div>

      {/* Legend — bottom-right */}
      <div style={panelStyle("right")}>
        <div style={{ ...labelStyle, marginBottom: 6 }}>Complaints</div>
        {COLORS.map((c, i) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, margin: "2px 0" }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: c, flex: "0 0 auto" }} />
            {bucketLabel(i)}
          </div>
        ))}
      </div>
    </div>
  );
}

function panelStyle(side) {
  return {
    position: "absolute",
    bottom: 16,
    [side]: 12,
    zIndex: 500,
    background: "#fff",
    border: "1px solid #E3E5E1",
    borderRadius: 8,
    boxShadow: "0 2px 10px rgba(20,30,30,0.10)",
    padding: "12px 14px",
    minWidth: 180,
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
    color: "#1C2321",
  };
}

const labelStyle = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#5B6B73",
};
