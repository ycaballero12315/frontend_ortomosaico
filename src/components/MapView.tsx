import {
  MapContainer,
  TileLayer,
  ImageOverlay,
  useMap, 
  Marker,
  Popup
} from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

const FitBounds: React.FC<{ bounds: L.LatLngBoundsLiteral }> = ({ bounds }) => {
  const map = useMap();
  map.fitBounds(bounds);
  return null;
};

interface Props {
  geojsonData: any;
  imageUrl: string | null;
  imageBounds: L.LatLngBoundsLiteral | null;
}
const createCustomIcon = (color: string, nivel: string) => {
  const iconColor = color === "red" ? "#ef4444" : "#eab308";
  const borderColor = color === "red" ? "#dc2626" : "#ca8a04";
  const emoji = nivel === "alto" ? "⚠️" : "⚡";

  const htmlIcon = `
    <div style="position: relative; width: 40px; height: 50px;">
      <style>
        @keyframes wave {
          0%, 100% { 
            d: path("M 5 5 Q 20 3 35 5 L 35 25 Q 20 27 5 25 Z"); 
          }
          25% { 
            d: path("M 5 5 Q 20 7 35 5 L 35 25 Q 20 23 5 25 Z"); 
          }
          50% { 
            d: path("M 5 5 Q 20 3 35 5 L 35 25 Q 20 27 5 25 Z"); 
          }
          75% { 
            d: path("M 5 5 Q 20 7 35 5 L 35 25 Q 20 23 5 25 Z"); 
          }
        }
      </style>
      <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${color}">
            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Asta de la bandera -->
        <line x1="5" y1="5" x2="5" y2="48" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/>
        
        <!-- Bandera ondeante -->
        <path fill="${iconColor}" stroke="${borderColor}" stroke-width="1.5" filter="url(#shadow-${color})">
          <animate 
            attributeName="d" 
            values="
              M 5 5 Q 20 3 35 5 L 35 25 Q 20 27 5 25 Z;
              M 5 5 Q 20 7 35 5 L 35 25 Q 20 23 5 25 Z;
              M 5 5 Q 20 3 35 5 L 35 25 Q 20 27 5 25 Z;
              M 5 5 Q 20 7 35 5 L 35 25 Q 20 23 5 25 Z;
              M 5 5 Q 20 3 35 5 L 35 25 Q 20 27 5 25 Z
            "
            dur="2s" 
            repeatCount="indefinite"
          />
        </path>
        
        <!-- Emoji en la bandera -->
        <text x="20" y="18" font-size="12" text-anchor="middle" style="pointer-events: none;">
          <animate 
            attributeName="x" 
            values="20;21;20;19;20" 
            dur="2s" 
            repeatCount="indefinite"
          />
          ${emoji}
        </text>
        
        <!-- Base del asta -->
        <circle cx="5" cy="48" r="3" fill="#374151"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: htmlIcon,
    className: "custom-flag-marker",
    iconSize: [40, 50],
    iconAnchor: [5, 48],
    popupAnchor: [15, -40],
  });
};
export const MapView: React.FC<Props> = ({
  geojsonData,
  imageUrl,
  imageBounds,
}) => {
  console.log("🗺️ MAP VIEW");
  console.log("imageUrl:", imageUrl);
  console.log("imageBounds:", imageBounds);
  const markers = useMemo(() => {
    if (!geojsonData || !geojsonData.features) return [];

    return geojsonData.features.map((feature: any, idx: number) => {
      const [lon, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      return {
        position: [lat, lon] as L.LatLngExpression,
        icon: createCustomIcon(props.color, props.nivel),
        popup: `
          <div style="min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 20px;">${props.nivel === "alto" ? "🚨" : "⚠️"}</span>
              <strong style="font-size: 16px; color: #1f2937;">${props.titulo}</strong>
            </div>
            <div style="background: ${props.color === "red" ? "#fee2e2" : "#fef3c7"}; padding: 8px; border-radius: 6px; border-left: 3px solid ${props.color === "red" ? "#dc2626" : "#ca8a04"}; margin-bottom: 8px;">
              <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.4;">
                ${props.descripcion}
              </p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6b7280;">
              <span style="background: ${props.color === "red" ? "#dc2626" : "#ca8a04"}; color: white; padding: 2px 8px; border-radius: 12px; font-weight: 600;">
                ${props.nivel.toUpperCase()}
              </span>
              <span style="font-weight: 500;">
                Confianza: <strong>${(props.confianza * 100).toFixed(0)}%</strong>
              </span>
            </div>
          </div>
        `,
        key: `marker-${idx}`,
      };
    });
  }, [geojsonData]);
  return (
    <MapContainer
      key={imageUrl ?? "map"}
      center={[0, 0]}
      zoom={3}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {imageBounds && <FitBounds bounds={imageBounds} />}
      {imageUrl && imageBounds && (
        <ImageOverlay url={imageUrl} bounds={imageBounds} opacity={0.85} />
      )}

      {markers.map((marker: any) => (
  <Marker 
    key={marker.key} 
    position={marker.position} 
    icon={marker.icon}
  >
    <Popup>
      <div dangerouslySetInnerHTML={{ __html: marker.popup }} />
    </Popup>
  </Marker>
))}
    </MapContainer>
  );
};
