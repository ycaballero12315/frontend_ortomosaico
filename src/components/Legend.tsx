import React from "react";
import { styles } from "../styles";

interface Props {
  show: boolean;
}

export const Legend: React.FC<Props> = ({ show }) => {
  if (!show) return null;

  const items = [
    { color: "#FF0000", label: "Persona sin casco (Alto)", type: "circle" },
    { color: "#FF6600", label: "Persona sin casco (Medio)", type: "circle" },
    { color: "#0066FF", label: "Camión", type: "circle" },
    { color: "#FFCC00", label: "Excavadora", type: "circle" },
    {
      color: "rgba(255,0,0,0.3)",
      label: "Zona riesgo alto",
      type: "square",
      border: "#990000",
    },
    {
      color: "rgba(255,204,0,0.3)",
      label: "Zona riesgo medio",
      type: "square",
      border: "#CC9900",
    },
  ];

  return (
    <div style={styles.legend}>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>Leyenda</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{
                width: item.type === "circle" ? "24px" : "24px",
                height: item.type === "circle" ? "24px" : "16px",
                borderRadius: item.type === "circle" ? "50%" : "0",
                background: item.color,
                border:
                  item.type === "circle"
                    ? "2px solid white"
                    : `2px solid ${item.border}`,
                boxShadow:
                  item.type === "circle" ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
              }}
            />
            <span style={{ fontSize: "14px" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
