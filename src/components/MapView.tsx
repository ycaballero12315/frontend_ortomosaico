import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ImageOverlay,
  useMap,
} from "react-leaflet";
import L from "leaflet";

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

export const MapView: React.FC<Props> = ({
  geojsonData,
  imageUrl,
  imageBounds,
}) => {
  console.log("🗺️ MAP VIEW");
  console.log("imageUrl:", imageUrl);
  console.log("imageBounds:", imageBounds);
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

      {geojsonData && (
        <GeoJSON
          data={geojsonData}
          pointToLayer={(feature, latlng) => {
            const color = feature.properties.color;

            return L.circleMarker(latlng, {
              radius: 10,
              fillColor: color,
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.9,
            });
          }}
          onEachFeature={(feature, layer) => {
            const p = feature.properties;

            layer.bindPopup(`
          <strong>${p.titulo}</strong><br/>
          <b>Nivel:</b> ${p.nivel.toUpperCase()}<br/>
          <b>Confianza:</b> ${(p.confianza * 100).toFixed(1)}%<br/>
          <hr/>
          ${p.descripcion}
      `);
          }}
        />
      )}
    </MapContainer>
  );
};
