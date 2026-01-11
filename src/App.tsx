import React, { useState } from "react";
import L from "leaflet";
import { Header } from "./components/Header";
import { Toolbar } from "./components/Toolbar";
import { Legend } from "./components/Legend";
import { MapView } from "./components/MapView";
import { GeoJSONData, Stats } from "./types";
import { calculateStats, calculateBounds } from "./utils";
import { styles } from "./styles";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const App: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<GeoJSONData | null>(null);
  const [stats, setStats] = useState<Stats>({
    personas: 0,
    vehiculos: 0,
    zonas: 0,
  });
  const [showLegend, setShowLegend] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsLiteral | null>(
    null
  );

  const handleLoadGeojson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: GeoJSONData = JSON.parse(e.target?.result as string);
        setGeojsonData(data);
        setStats(calculateStats(data));

        // Calcular bounds para la imagen
        const bounds = calculateBounds(data);
        if (bounds) {
          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();
          setImageBounds([
            [sw.lat, sw.lng],
            [ne.lat, ne.lng],
          ]);
        }
      } catch (err) {
        alert("Error al cargar GeoJSON");
      }
    };
    reader.readAsText(file);
  };

  const handleLoadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/convert-orthomosaic", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error en el backend");

      const data = await res.json();

      setImageUrl(data.image_url);
      setImageBounds(data.bounds);
    } catch (err) {
      alert("No se pudo cargar el ortomosaico");
      console.error(err);
    }
  };

  return (
    <div style={styles.app}>
      <Header />
      <Toolbar
        stats={stats}
        onLoadGeojson={handleLoadGeojson}
        onLoadImage={handleLoadImage}
        onToggleLegend={() => setShowLegend(!showLegend)}
        showLegend={showLegend}
      />
      <div style={styles.mapContainer}>
        <MapView
          geojsonData={geojsonData}
          imageUrl={imageUrl}
          imageBounds={imageBounds}
        />
        <Legend show={showLegend} />
      </div>
    </div>
  );
};

export default App;
