import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { getOutbreaks } from "@/services/outbreak.service";
import { toast } from "@/hooks/use-toast";

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

import { Outbreak } from "@/services/outbreak.service";

interface OutbreakLocation extends Omit<Outbreak, 'latitude' | 'longitude'> {
  coordinates: [number, number];
}

const farmLocation: [number, number] = [28.7041, 77.1025]; // [Lat, Lng]

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

export function OutbreakMap() {
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakLocation | null>(null);
  const [outbreakData, setOutbreakData] = useState<OutbreakLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutbreaks = async () => {
      try {
        const data = await getOutbreaks();
        // Transform API data to match component interface
        const transformed = data.map(outbreak => ({
          id: outbreak.id,
          name: outbreak.name,
          type: outbreak.type as any,
          coordinates: [outbreak.latitude, outbreak.longitude] as [number, number],
          severity: outbreak.severity as any,
          date: outbreak.date,
          affectedAnimals: outbreak.affectedAnimals,
          riskRadius: outbreak.riskRadius
        }));
        setOutbreakData(transformed);
      } catch (error) {
        console.error("Failed to fetch outbreaks:", error);
        toast({
          title: "Error loading outbreaks",
          description: "Could not load disease outbreak data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOutbreaks();
  }, []);

  // Custom icon creator
  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: "custom-icon",
      html: `<div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const farmIcon = L.divIcon({
    className: "farm-icon",
    html: `<div style="
      background-color: #10b981;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  if (loading) {
    return (
      <div className="relative w-full z-0 h-[600px] flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading outbreak data...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full z-0 h-[600px]">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Farm Location */}
        <Marker position={farmLocation} icon={farmIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">Your Farm</h3>
              <p className="text-sm text-gray-600">Current location</p>
            </div>
          </Popup>
        </Marker>

        {/* Outbreaks */}
        {outbreakData.map((outbreak) => (
          <div key={outbreak.id}>
            {/* Risk Zone Circle */}
            <Circle
              center={outbreak.coordinates}
              radius={outbreak.riskRadius * 1000} // meters
              pathOptions={{
                color: diseaseColors[outbreak.type],
                fillColor: diseaseColors[outbreak.type],
                fillOpacity: severityOpacity[outbreak.severity],
                weight: 1,
              }}
            />

            {/* Outbreak Marker */}
            <Marker
              position={outbreak.coordinates}
              icon={createCustomIcon(diseaseColors[outbreak.type])}
              eventHandlers={{
                click: () => setSelectedOutbreak(outbreak),
              }}
            >
              <Popup>
                <div className="min-w-[200px] p-1">
                  <h4 className="font-bold text-sm mb-1">{outbreak.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs uppercase font-semibold" style={{ color: diseaseColors[outbreak.type] }}>
                      {outbreak.severity} Severity
                    </span>
                    <span className="text-xs text-muted-foreground">{outbreak.riskRadius}km Risk Zone</span>
                  </div>
                  <p className="text-xs mt-2 font-medium">
                    Confirmed Cases: {outbreak.affectedAnimals.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Reported: {new Date(outbreak.date).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 left-4 rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm z-[1000]">
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
      </div>

      {/* Selected Outbreak Panel */}
      {selectedOutbreak && (
        <div className="absolute right-4 top-4 w-72 rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm z-[1000]">
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
    </div>
  );
}
