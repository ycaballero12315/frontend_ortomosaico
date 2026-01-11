import { CSSProperties } from "react";

export const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  },

  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "20px 30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  toolbar: {
    padding: "15px 30px",
    background: "#f8f9fa",
    borderBottom: "1px solid #dee2e6",
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  button: {
    padding: "10px 20px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  } as CSSProperties,

  legend: {
    position: "absolute" as const,
    top: "20px",
    right: "20px",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    minWidth: "250px",
  },

  mapContainer: {
    flex: 1,
    position: "relative" as const,
  },
};
