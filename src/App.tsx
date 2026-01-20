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
    null,
  );

  const handleLoadGeojson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: GeoJSONData = JSON.parse(e.target?.result as string);
        console.log("✅ GeoJSON cargado:", data);
        setGeojsonData(data);
        setStats(calculateStats(data));
      } catch (err) {
        console.error("Error parseando GeoJSON:", err);
        alert("Error al cargar GeoJSON");
      }
    };
    reader.readAsText(file);
  };

  const handleLoadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4010/convert-orthomosaic", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errrText = await res.text();
        console.error("Error del backend:", errrText);
        throw new Error("Error en el backend");
      }

      const data = await res.json();
      console.log("Backend response", data);

      if (data.bounds && data.bounds.length === 2) {
        setImageBounds(data.bounds);
        console.log("Imagen y bounds configurados:", {
          url: data.image_url,
          bounds: data.bounds,
        });
      } else {
        console.warn("Backend no devolvió bounds, usando fallback UTM 17N"); // ⭐ NUEVO
        setImageUrl(data.image_url);
        setImageBounds([
          [41.304, -81.0],
          [41.308, -80.996],
        ]);
      }
    } catch (err) {
      console.error("Error completo", err);
      alert("No se pudo cargar el ortomosaico" + err);
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
