import L from "leaflet";
import { GeoJSONData, Stats, FeatureProperties } from "./types";

export const calculateStats = (data: GeoJSONData): Stats => {
  let personas = 0;
  let vehiculos = 0;
  let zonas = 0;

  data.features.forEach((f) => {
    const cat = f.properties.categoria?.toLowerCase() || "";
    if (cat.includes("persona")) personas++;
    else if (
      cat.includes("camion") ||
      cat.includes("excavadora") ||
      cat.includes("vehiculo")
    )
      vehiculos++;
    else if (f.properties.tipo === "zona_riesgo") zonas++;
  });

  return { personas, vehiculos, zonas };
};

export const calculateBounds = (data: GeoJSONData): L.LatLngBounds | null => {
  const points = data.features
    .filter((f) => f.geometry.type === "Point")
    .map((f) => L.latLng(f.geometry.coordinates[1], f.geometry.coordinates[0]));

  return points.length > 0 ? L.latLngBounds(points) : null;
};

export const createIcon = (color: string, emoji: string) => {
  return L.divIcon({
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px">${emoji}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const getIcon = (props: FeatureProperties) => {
  const cat = props.categoria?.toLowerCase() || "";

  if (cat.includes("persona")) {
    return createIcon(props.riesgo === "ALTO" ? "#FF0000" : "#FF6600", "⚠️");
  }
  if (cat.includes("camion")) return createIcon("#0066FF", "🚚");
  if (cat.includes("excavadora")) return createIcon("#FFCC00", "🚜");

  return createIcon("#00CC66", "📍");
};

export const getStyle = (feature: any) => {
  const props = feature?.properties;

  if (props?.tipo === "zona_riesgo") {
    return {
      fillColor: "red",
      fillOpacity: 0.3,
      color: "red",
      weight: 2,
    };
  }

  return {
    color: "blue",
    weight: 2,
  };
};
