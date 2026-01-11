import React, { useRef } from "react";
import { styles } from "../styles";
import { Stats } from "../types";

interface Props {
  stats: Stats;
  onLoadGeojson: (file: File) => void;
  onLoadImage: (file: File) => void;
  onToggleLegend: () => void;
  showLegend: boolean;
}

export const Toolbar: React.FC<Props> = ({
  stats,
  onLoadGeojson,
  onLoadImage,
  onToggleLegend,
  showLegend,
}) => {
  const geojsonRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <div style={styles.toolbar}>
      <button style={styles.button} onClick={() => geojsonRef.current?.click()}>
        📁 Cargar GeoJSON
      </button>
      <input
        ref={geojsonRef}
        type="file"
        accept=".geojson,.json"
        style={{ display: "none" }}
        onChange={(e) =>
          e.target.files?.[0] && onLoadGeojson(e.target.files[0])
        }
      />

      <button style={styles.button} onClick={() => imageRef.current?.click()}>
        🗺️ Cargar Ortomosaico
      </button>
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && onLoadImage(e.target.files[0])}
      />

      <button
        style={{
          ...styles.button,
          background: "white",
          color: "#333",
          border: "1px solid #dee2e6",
        }}
        onClick={onToggleLegend}
      >
        {showLegend ? "🔽" : "▶️"} Leyenda
      </button>

      <div style={{ marginLeft: "auto", display: "flex", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>⚠️</span>
          <strong>{stats.personas}</strong>
          <span style={{ color: "#666", fontSize: "14px" }}>Personas</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🚚</span>
          <strong>{stats.vehiculos}</strong>
          <span style={{ color: "#666", fontSize: "14px" }}>Vehículos</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>⚡</span>
          <strong>{stats.zonas}</strong>
          <span style={{ color: "#666", fontSize: "14px" }}>Zonas</span>
        </div>
      </div>
    </div>
  );
};
