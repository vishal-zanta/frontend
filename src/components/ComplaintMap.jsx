import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  Polygon,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, RotateCcw, MapPin, Eye, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import RecentComplaintsSection from "@/pages/admin/dashboard/components/RecentComplaintsSection";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const DISTRICTS_URL = "/data/bihar-districts.geojson";
const MASK_URL = "/data/bihar-mask.geojson";

// Fallback sample data for all 38 districts of Bihar
const SAMPLE_DATA = {
  "West Champaran": 46,
  "East Champaran": 24,
  Sitamarhi: 55,
  Sheohar: 11,
  Gopalganj: 14,
  Samastipur: 73,
  Katihar: 17,
  Khagaria: 51,
  Bhojpur: 79,
  Buxar: 12,
  Darbhanga: 175,
  Saharsa: 32,
  Kaimur: 9,
  Rohtas: 16,
  Jamui: 60,
  Banka: 58,
  Nawada: 13,
  Gaya: 205,
  Munger: 16,
  Vaishali: 75,
  Begusarai: 95,
  Bhagalpur: 130,
  Lakhisarai: 77,
  Sheikhpura: 20,
  Arwal: 33,
  Jehanabad: 85,
  Nalanda: 90,
  Patna: 380,
  Saran: 12,
  Siwan: 78,
  Muzaffarpur: 150,
  Madhepura: 55,
  Araria: 11,
  Supaul: 33,
  Madhubani: 10,
  Purnia: 120,
  Kishanganj: 22,
  Aurangabad: 42,
};

const BREAKS = [0, 40, 90, 160, 260, 400];
const COLORS = [
  "#38bdf8", // Sky blue for low volume
  "#34d399", // Emerald
  "#fbbf24", // Amber
  "#fb923c", // Orange
  "#f87171", // Light Red
  "#dc2626", // Deep Red
];

// Simplified ward polygon for Kankarbagh area (Patna)
const wardPolygon = [
  [25.615, 85.12],
  [25.62, 85.125],
  [25.622, 85.135],
  [25.618, 85.145],
  [25.612, 85.143],
  [25.608, 85.13],
];

function getColor(count) {
  for (let i = BREAKS.length - 1; i >= 0; i--) {
    if (count >= BREAKS[i]) return COLORS[i];
  }
  return COLORS[0];
}

function getRadius(count) {
  if (count >= 300) return 18;
  if (count >= 180) return 15;
  if (count >= 100) return 13;
  if (count >= 50) return 11;
  if (count >= 20) return 9;
  return 7.5;
}

function bucketLabel(i) {
  return i === BREAKS.length - 1
    ? `${BREAKS[i]}+`
    : `${BREAKS[i]}–${BREAKS[i + 1] - 1}`;
}

// Controls map bounds and zoom limits to lock the camera strictly to Bihar
function MapController({ bounds, searchTargetDistrict, resetTrigger }) {
  const map = useMap();

  const fitToBihar = useCallback(() => {
    if (!bounds || !map) return;
    map.invalidateSize();
    map.fitBounds(bounds, {
      padding: [6, 6],
      maxZoom: 9,
      animate: false,
    });
    map.setMaxBounds(bounds.pad(0.08));
    const tightMinZoom = map.getBoundsZoom(bounds, false, [6, 6]);
    map.setMinZoom(Math.max(6.5, tightMinZoom - 0.2));
  }, [bounds, map]);

  useEffect(() => {
    fitToBihar();
    const timer = setTimeout(() => {
      if (map) {
        map.invalidateSize();
        fitToBihar();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [bounds, map, resetTrigger, fitToBihar]);

  useEffect(() => {
    if (!searchTargetDistrict || !map) return;
    map.fitBounds(searchTargetDistrict.bounds, {
      maxZoom: 9.5,
      padding: [20, 20],
      animate: true,
    });
  }, [searchTargetDistrict, map]);

  return null;
}

export default function ComplaintMap({
  height = 420,
  complaintsByDistrict,
  districtData,
  highlightWard = false,
  showSearch = true,
  showLegend = true,
  showInfo = true,
  center = [25.75, 85.85],
  zoom = 7.4,
  onDistrictClick,
}) {
  const { t } = useLanguage();
  const themeContext = useTheme();
  const isDark = themeContext?.theme === "dark";

  const [districts, setDistricts] = useState(null);
  const [mask, setMask] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [active, setActive] = useState(null); // { name, count, details }
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTarget, setSearchTarget] = useState(null);
  const [resetCount, setResetCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState("");

  const geoJsonRef = useRef(null);

  // Normalize complaint counts dictionary from various prop shapes
  const normalizedData = useMemo(() => {
    if (complaintsByDistrict && typeof complaintsByDistrict === "object") {
      return complaintsByDistrict;
    }

    if (Array.isArray(districtData) && districtData.length > 0) {
      const mapObj = {};
      districtData.forEach((item) => {
        const districtName = item.name || item.district || item._id;
        if (districtName) {
          mapObj[districtName] =
            item.total ?? item.count ?? item.complaints ?? 0;
        }
      });
      return mapObj;
    }

    return SAMPLE_DATA;
  }, [complaintsByDistrict, districtData]);

  // Lookup details for active district if available
  const districtDetailsMap = useMemo(() => {
    const details = {};
    if (Array.isArray(districtData)) {
      districtData.forEach((item) => {
        const name = item.name || item.district || item._id;
        if (name) details[name.toLowerCase()] = item;
      });
    }
    return details;
  }, [districtData]);

  const dataRef = useRef(normalizedData);
  dataRef.current = normalizedData;

  // Load District and Mask GeoJSONs
  useEffect(() => {
    let isMounted = true;

    fetch(DISTRICTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load district geojson");
        return res.json();
      })
      .then((gj) => {
        if (!isMounted) return;
        setDistricts(gj);
        const geoLayer = L.geoJSON(gj);
        setBounds(geoLayer.getBounds());
      })
      .catch((err) => {
        console.error("Error loading district boundaries:", err);
      });

    fetch(MASK_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load mask geojson");
        return res.json();
      })
      .then((maskGj) => {
        if (!isMounted) return;
        setMask(maskGj);
      })
      .catch((err) => {
        console.error("Error loading map mask:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute District Centroid Circles so base map labels remain 100% visible
  const districtCentroids = useMemo(() => {
    if (!districts?.features) return [];
    return districts.features.map((feature) => {
      const name = feature.properties.district;
      const count = normalizedData[name] ?? normalizedData[name?.trim()] ?? 0;
      const b = L.geoJSON(feature).getBounds();
      const centerPt = b.getCenter();
      const details = districtDetailsMap[name.toLowerCase()] || null;
      return {
        name,
        count,
        lat: centerPt.lat,
        lng: centerPt.lng,
        bounds: b,
        details,
      };
    });
  }, [districts, normalizedData, districtDetailsMap]);

  // District boundary style (clean boundaries with high transparency to keep map labels readable)
  const styleFeature = useCallback(
    (feature) => {
      const name = feature?.properties?.district;
      const isHovered = active?.name === name;

      return {
        fillColor: isHovered
          ? isDark
            ? "#38bdf8"
            : "#0284c7"
          : isDark
            ? "#1e293b"
            : "#f8fafc",
        fillOpacity: isHovered ? 0.25 : 0.06,
        color: isHovered
          ? isDark
            ? "#38bdf8"
            : "#0284c7"
          : isDark
            ? "#475569"
            : "#94a3b8",
        weight: isHovered ? 2.4 : 1.2,
      };
    },
    [isDark, active],
  );

  // Dynamic re-styling when theme or active selection changes
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(styleFeature);
    }
  }, [styleFeature, isDark, active]);

  // List of all district names for search autocomplete
  const districtNamesList = useMemo(() => {
    if (!districts?.features) return Object.keys(SAMPLE_DATA).sort();
    return districts.features
      .map((f) => f.properties.district)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [districts]);

  const handleDistrictSelect = (nameToFind) => {
    if (!nameToFind || !districtCentroids.length) return;
    const targetItem = districtCentroids.find(
      (d) => d.name.toLowerCase() === nameToFind.trim().toLowerCase(),
    );

    if (targetItem) {
      setSearchTarget({ bounds: targetItem.bounds, name: targetItem.name });
      setActive({
        name: targetItem.name,
        count: targetItem.count,
        details: targetItem.details,
      });
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    handleDistrictSelect(searchQuery);
  };

  const handleResetView = () => {
    setSearchQuery("");
    setSearchTarget(null);
    setActive(null);
    setResetCount((prev) => prev + 1);
  };

  const handleOpenDrilldown = (placeName) => {
    setSelectedPlace(placeName || active?.name || "Bihar");
    setOpenDialog(true);
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.district;

    layer.on({
      mouseover: () => {
        const count = dataRef.current[name] || 0;
        const details = districtDetailsMap[name.toLowerCase()] || null;
        setActive({ name, count, details });
      },
      mouseout: () => {
        // Keep active or reset
      },
      click: (e) => {
        const l = e.target;
        const mapInstance = l._map;
        if (mapInstance) {
          mapInstance.fitBounds(l.getBounds(), {
            maxZoom: 9,
            padding: [20, 20],
          });
        }
        const currentCount = dataRef.current[name] || 0;
        const details = districtDetailsMap[name.toLowerCase()] || null;
        setActive({ name, count: currentCount, details });

        if (onDistrictClick) {
          onDistrictClick(name, currentCount, details);
        } else {
          handleOpenDrilldown(name);
        }
      },
    });
  };

  const containerHeight = typeof height === "number" ? `${height}px` : height;

  // 100% Free Public Tiles (No API key, No watermarks)
  const tileUrl = isDark
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
    : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";

  const maskColor = isDark ? "#090d16" : "#F3F4F1";

  return (
    <>
      <div
        style={{ height: containerHeight, isolation: "isolate" }}
        className="relative z-0 isolate w-full rounded-xl overflow-hidden border border-border shadow-sm bg-muted/20 font-sans"
      >
        {!districts || !mask ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[550] text-muted-foreground gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">
              {t(
                "Loading Bihar District Map...",
                "बिहार जिला मानचित्र लोड हो रहा है...",
              )}
            </span>
          </div>
        ) : null}

        <MapContainer
          center={center}
          zoom={zoom}
          zoomSnap={0.1}
          zoomDelta={0.25}
          maxZoom={11}
          zoomControl={true}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "100%",
            background: isDark ? "#0b0f19" : "#EAECE8",
          }}
        >
          {bounds && (
            <MapController
              bounds={bounds}
              searchTargetDistrict={searchTarget}
              resetTrigger={resetCount}
            />
          )}

          {/* 100% Free Public Map Tiles (No API Key Required) */}
          <TileLayer
            key={tileUrl}
            url={tileUrl}
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap contributors'
            maxZoom={11}
          />

          {/* World Mask Layer - Hides regions outside Bihar */}
          {mask && (
            <GeoJSON
              key={maskColor}
              data={mask}
              interactive={false}
              style={{
                fillColor: maskColor,
                fillOpacity: isDark ? 0.96 : 0.94,
                stroke: false,
              }}
            />
          )}

          {/* 38 Bihar District Boundary Outlines */}
          {districts && (
            <GeoJSON
              ref={geoJsonRef}
              data={districts}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          )}

          {/* District Density Circles (Clean, non-obscuring bubble markers) */}
          {districtCentroids.map((d) => {
            const isHovered = active?.name === d.name;
            const radius = getRadius(d.count);
            const color = getColor(d.count);

            return (
              <CircleMarker
                key={d.name}
                center={[d.lat, d.lng]}
                radius={isHovered ? radius + 4 : radius}
                pathOptions={{
                  color: isHovered
                    ? isDark
                      ? "#ffffff"
                      : "#0f172a"
                    : isDark
                      ? "#ffffff"
                      : "#ffffff",
                  fillColor: color,
                  fillOpacity: isHovered ? 0.98 : 0.85,
                  weight: isHovered ? 2.5 : 1.5,
                }}
                eventHandlers={{
                  mouseover: () => {
                    setActive({
                      name: d.name,
                      count: d.count,
                      details: d.details,
                    });
                  },
                  click: (e) => {
                    const l = e.target;
                    const mapInstance = l._map;
                    if (mapInstance) {
                      mapInstance.fitBounds(d.bounds, {
                        maxZoom: 9,
                        padding: [20, 20],
                      });
                    }
                    setActive({
                      name: d.name,
                      count: d.count,
                      details: d.details,
                    });
                    if (onDistrictClick) {
                      onDistrictClick(d.name, d.count, d.details);
                    } else {
                      handleOpenDrilldown(d.name);
                    }
                  },
                }}
              >
                {isHovered && (
                  <Tooltip
                    key={`tooltip-${d.name}`}
                    permanent
                    direction="top"
                    offset={[0, -radius - 4]}
                    className="custom-district-tooltip"
                  >
                    <div className="text-xs font-sans">
                      <span className="font-bold">{d.name}</span>:{" "}
                      <span className="font-semibold text-primary">
                        {d.count}
                      </span>{" "}
                      complaints
                    </div>
                </Tooltip>
                )}
              </CircleMarker>
            );
          })}

          {/* Optional Ward Boundary Polygon */}
          {highlightWard && (
            <Polygon
              positions={wardPolygon}
              pathOptions={{
                color: "#1d4ed8",
                fillColor: "#3b82f6",
                fillOpacity: 0.35,
                weight: 2,
              }}
            >
              <Popup>Patna Ward-12 (Highlighted Master Ward Area)</Popup>
            </Polygon>
          )}
        </MapContainer>

        {/* Top Controls: Search Autocomplete & Reset */}
        {showSearch && (
          <div className="absolute top-3 right-3 z-[500] flex items-center gap-1.5 bg-background/95 backdrop-blur-md p-1.5 rounded-lg border border-border shadow-md">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-1.5"
            >
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  list="bihar-district-datalist"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Jump to district...", "जिला खोजें...")}
                  className="h-8 pl-8 pr-2 text-xs bg-muted/40 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-36 sm:w-44 text-foreground placeholder:text-muted-foreground"
                />
                <datalist id="bihar-district-datalist">
                  {districtNamesList.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>
              <button
                type="submit"
                className="h-8 px-2.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1 shadow-sm"
              >
                {t("Go", "जाएं")}
              </button>
            </form>

            <button
              type="button"
              onClick={handleResetView}
              title={t("Reset View to Bihar", "मानचित्र रीसेट करें")}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bottom-Left: District Details Card */}
        {showInfo && (
          <div className="absolute bottom-3 left-3 z-[500] bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg p-3 min-w-[200px] max-w-[280px]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                {t("District", "जिला")}
              </span>
              {active && (
                <button
                  type="button"
                  onClick={() => handleOpenDrilldown(active.name)}
                  className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-medium"
                >
                  <Eye className="w-3 h-3" />
                  {t("View", "देखें")}
                </button>
              )}
            </div>

            <div className="text-sm sm:text-base font-bold text-foreground truncate">
              {active ? active.name : "—"}
            </div>

            <div className="text-xs text-muted-foreground mt-0.5 font-medium">
              {active ? (
                <span className="text-foreground font-semibold">
                  {active.count.toLocaleString("en-IN")}{" "}
                  <span className="text-muted-foreground font-normal">
                    {t("complaints", "शिकायतें")}
                  </span>
                </span>
              ) : (
                t(
                  "Hover or click a district",
                  "जिले पर कर्सर ले जाएं या क्लिक करें",
                )
              )}
            </div>

            {/* Quick Status Pill breakdown if district details are available */}
            {active?.details && (
              <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-border/60 text-[10px]">
                <div className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded text-center">
                  <div className="font-bold">
                    {active.details.resolved || 0}
                  </div>
                  <div className="text-[9px] opacity-80">
                    {t("Res.", "निराकृत")}
                  </div>
                </div>
                <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-center">
                  <div className="font-bold">{active.details.pending || 0}</div>
                  <div className="text-[9px] opacity-80">
                    {t("Pend.", "लंबित")}
                  </div>
                </div>
                <div className="bg-red-500/10 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded text-center">
                  <div className="font-bold">
                    {active.details.escalated || 0}
                  </div>
                  <div className="text-[9px] opacity-80">
                    {t("Esc.", "बढ़ी")}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom-Right: Color & Size Scale Legend */}
        {showLegend && (
          <div className="absolute bottom-3 right-3 z-[500] bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg p-2.5 sm:p-3 text-xs">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-primary" />
              {t("Complaints Volume", "शिकायत मात्रा")}
            </div>
            <div className="space-y-1.5">
              {COLORS.map((c, i) => (
                <div
                  key={c}
                  className="flex items-center gap-2.5 text-[11px] font-medium text-foreground"
                >
                  <span
                    className="rounded-full shadow-sm border border-white/60 dark:border-black/40 flex-shrink-0"
                    style={{
                      backgroundColor: c,
                      width: `${Math.max(8, 7 + i * 2)}px`,
                      height: `${Math.max(8, 7 + i * 2)}px`,
                    }}
                  />
                  <span>{bucketLabel(i)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drill-down Dialog for District Complaints */}
      <ComplaintByPlaceDialog
        open={openDialog}
        setOpen={setOpenDialog}
        place={selectedPlace}
      />
    </>
  );
}

const ComplaintByPlaceDialog = ({ open, setOpen, place }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] overflow-y-auto p-0 border border-border z-[9999]">
        <DialogHeader className="pb-3 border-b border-border px-4 sm:px-6 py-3 bg-muted/30">
          <DialogTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t("Complaints in", "शिकायतें -")} {place}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 px-4 sm:px-6 pb-6">
          <RecentComplaintsSection />
        </div>
      </DialogContent>
    </Dialog>
  );
};
