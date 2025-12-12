import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertTriangle, MapPin, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OutbreakLocation {
  id: string;
  name: string;
  type: "avian_influenza" | "african_swine_fever" | "newcastle_disease" | "foot_mouth";
  coordinates: [number, number];
  severity: "high" | "medium" | "low";
  date: string;
  affectedAnimals: number;
  riskRadius: number; // in km
}

const outbreakData: OutbreakLocation[] = [
  {
    id: "1",
    name: "H5N1 Outbreak - District A",
    type: "avian_influenza",
    coordinates: [77.5946, 12.9716],
    severity: "high",
    date: "2024-01-28",
    affectedAnimals: 5000,
    riskRadius: 50,
  },
  {
    id: "2",
    name: "ASF Alert - Region B",
    type: "african_swine_fever",
    coordinates: [77.2090, 28.6139],
    severity: "high",
    date: "2024-01-25",
    affectedAnimals: 800,
    riskRadius: 40,
  },
  {
    id: "3",
    name: "Newcastle Disease - Area C",
    type: "newcastle_disease",
    coordinates: [72.8777, 19.0760],
    severity: "medium",
    date: "2024-01-20",
    affectedAnimals: 2000,
    riskRadius: 25,
  },
  {
    id: "4",
    name: "H5N8 Suspected - Zone D",
    type: "avian_influenza",
    coordinates: [88.3639, 22.5726],
    severity: "low",
    date: "2024-01-15",
    affectedAnimals: 500,
    riskRadius: 15,
  },
  {
    id: "5",
    name: "FMD Outbreak - District E",
    type: "foot_mouth",
    coordinates: [80.2707, 13.0827],
    severity: "medium",
    date: "2024-01-22",
    affectedAnimals: 1200,
    riskRadius: 30,
  },
];

const farmLocation: [number, number] = [77.1025, 28.7041]; // Example farm location

const diseaseColors = {
  avian_influenza: "#dc2626",
  african_swine_fever: "#9333ea",
  newcastle_disease: "#ea580c",
  foot_mouth: "#0891b2",
};

const severityOpacity = {
  high: 0.35,
  medium: 0.25,
  low: 0.15,
};

const diseaseLabels = {
  avian_influenza: "Avian Influenza",
  african_swine_fever: "African Swine Fever",
  newcastle_disease: "Newcastle Disease",
  foot_mouth: "Foot & Mouth Disease",
};

interface OutbreakMapProps {
  mapboxToken?: string;
}

export function OutbreakMap({ mapboxToken: initialToken }: OutbreakMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(initialToken || "");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakLocation | null>(null);

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [78.9629, 20.5937], // Center on India
        zoom: 4,
        pitch: 0,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

      map.current.on("load", () => {
        if (!map.current) return;

        // Add farm location marker
        const farmMarkerEl = document.createElement("div");
        farmMarkerEl.className = "farm-marker";
        farmMarkerEl.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, hsl(152, 45%, 35%), hsl(160, 50%, 28%));
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        `;

        new mapboxgl.Marker(farmMarkerEl)
          .setLngLat(farmLocation)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">Your Farm</h3>
                <p style="color: #666; font-size: 12px;">Current location</p>
              </div>
            `)
          )
          .addTo(map.current);

        // Add risk zone circles and outbreak markers
        outbreakData.forEach((outbreak, index) => {
          if (!map.current) return;

          // Add risk zone circle as a source and layer
          const radiusInMeters = outbreak.riskRadius * 1000;
          const circleId = `risk-zone-${outbreak.id}`;

          map.current.addSource(circleId, {
            type: "geojson",
            data: createCircleGeoJSON(outbreak.coordinates, radiusInMeters),
          });

          map.current.addLayer({
            id: `${circleId}-fill`,
            type: "fill",
            source: circleId,
            paint: {
              "fill-color": diseaseColors[outbreak.type],
              "fill-opacity": severityOpacity[outbreak.severity],
            },
          });

          map.current.addLayer({
            id: `${circleId}-outline`,
            type: "line",
            source: circleId,
            paint: {
              "line-color": diseaseColors[outbreak.type],
              "line-width": 2,
              "line-opacity": 0.8,
            },
          });

          // Add outbreak marker
          const markerEl = document.createElement("div");
          markerEl.className = "outbreak-marker";
          markerEl.innerHTML = `
            <div style="
              width: 32px;
              height: 32px;
              background: ${diseaseColors[outbreak.type]};
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              animation: pulse 2s infinite;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          `;

          const popup = new mapboxgl.Popup({ offset: 25, closeButton: true }).setHTML(`
            <div style="padding: 12px; max-width: 250px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="
                  width: 12px;
                  height: 12px;
                  background: ${diseaseColors[outbreak.type]};
                  border-radius: 50%;
                "></div>
                <span style="
                  font-size: 10px;
                  font-weight: 600;
                  text-transform: uppercase;
                  color: ${diseaseColors[outbreak.type]};
                ">${outbreak.severity} severity</span>
              </div>
              <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${outbreak.name}</h3>
              <p style="color: #666; font-size: 12px; margin-bottom: 8px;">
                ${diseaseLabels[outbreak.type]}
              </p>
              <div style="font-size: 11px; color: #888;">
                <p>📅 Reported: ${new Date(outbreak.date).toLocaleDateString()}</p>
                <p>🐔 Affected: ${outbreak.affectedAnimals.toLocaleString()} animals</p>
                <p>📍 Risk zone: ${outbreak.riskRadius}km radius</p>
              </div>
            </div>
          `);

          new mapboxgl.Marker(markerEl)
            .setLngLat(outbreak.coordinates)
            .setPopup(popup)
            .addTo(map.current!);

          markerEl.addEventListener("click", () => {
            setSelectedOutbreak(outbreak);
          });
        });

        setIsMapLoaded(true);
        toast({
          title: "Map loaded successfully",
          description: "Showing disease outbreaks near your location",
        });
      });

      map.current.on("error", (e) => {
        console.error("Map error:", e);
        toast({
          title: "Map error",
          description: "Failed to load the map. Please check your Mapbox token.",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error("Map initialization error:", error);
      toast({
        title: "Invalid token",
        description: "Please enter a valid Mapbox public token.",
        variant: "destructive",
      });
    }
  };

  // Create circle GeoJSON
  const createCircleGeoJSON = (center: [number, number], radiusInMeters: number) => {
    const points = 64;
    const coords: [number, number][] = [];
    const km = radiusInMeters / 1000;

    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const dx = km * Math.cos((angle * Math.PI) / 180);
      const dy = km * Math.sin((angle * Math.PI) / 180);
      const lat = center[1] + (dy / 110.574);
      const lng = center[0] + (dx / (111.32 * Math.cos((center[1] * Math.PI) / 180)));
      coords.push([lng, lat]);
    }
    coords.push(coords[0]);

    return {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [coords],
      },
      properties: {},
    };
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  const handleLoadMap = () => {
    if (!token) {
      toast({
        title: "Token required",
        description: "Please enter your Mapbox public token.",
        variant: "destructive",
      });
      return;
    }
    initializeMap();
  };

  return (
    <div className="relative h-full w-full">
      {!isMapLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Connect Map</h3>
                <p className="text-sm text-muted-foreground">Enter your Mapbox public token</p>
              </div>
            </div>

            <div className="mb-4 rounded-lg bg-info/10 p-3">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Get your free token at{" "}
                  <a
                    href="https://mapbox.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-info hover:underline"
                  >
                    mapbox.com
                  </a>{" "}
                  → Account → Tokens
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
                <Input
                  id="mapbox-token"
                  type="text"
                  placeholder="pk.eyJ1IjoiLi4u"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleLoadMap} className="w-full">
                Load Outbreak Map
              </Button>
            </div>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="h-full w-full" />

      {/* Legend */}
      {isMapLoaded && (
        <div className="absolute bottom-6 left-4 rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm">
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
            <AlertTriangle className="h-4 w-4" />
            Disease Outbreaks
          </h4>
          <div className="space-y-2">
            {Object.entries(diseaseLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: diseaseColors[key as keyof typeof diseaseColors] }}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">Severity</p>
            <div className="mt-1 flex gap-2">
              <span className="text-xs text-destructive">● High</span>
              <span className="text-xs text-warning">● Medium</span>
              <span className="text-xs text-muted-foreground">● Low</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </div>
            <span className="text-xs text-muted-foreground">Your Farm</span>
          </div>
        </div>
      )}

      {/* Selected Outbreak Panel */}
      {selectedOutbreak && isMapLoaded && (
        <div className="absolute right-4 top-20 w-72 rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm">
          <div className="mb-3 flex items-start justify-between">
            <div
              className="rounded-full px-2 py-1 text-xs font-semibold uppercase"
              style={{
                backgroundColor: `${diseaseColors[selectedOutbreak.type]}20`,
                color: diseaseColors[selectedOutbreak.type],
              }}
            >
              {selectedOutbreak.severity} risk
            </div>
            <button
              onClick={() => setSelectedOutbreak(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <h3 className="mb-1 font-semibold text-foreground">{selectedOutbreak.name}</h3>
          <p className="mb-3 text-sm text-muted-foreground">
            {diseaseLabels[selectedOutbreak.type]}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reported</span>
              <span className="font-medium text-foreground">
                {new Date(selectedOutbreak.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Affected</span>
              <span className="font-medium text-foreground">
                {selectedOutbreak.affectedAnimals.toLocaleString()} animals
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Zone</span>
              <span className="font-medium text-foreground">{selectedOutbreak.riskRadius}km radius</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            View Full Report
          </Button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
