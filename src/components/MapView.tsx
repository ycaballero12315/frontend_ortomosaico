import { MapContainer, TileLayer, GeoJSON, ImageOverlay } from "react-leaflet";
import L from "leaflet";

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
  return (
    <MapContainer
      center={[-34.9011, -56.1645]}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {geojsonData && <GeoJSON data={geojsonData} />}

      {imageUrl && imageBounds && (
        <ImageOverlay
          url="/source/odm_orthophoto.png"
          bounds={[
            [-34.9025, -56.165],
            [-34.8995, -56.16],
          ]}
        />
      )}
    </MapContainer>
  );
};
