import React from "react";
import { styles } from "../styles";

export const Header: React.FC = () => (
  <div style={styles.header}>
    <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>
      🗺️ Visor de Ortomosaicos con Detecciones
    </h1>
    <p style={{ margin: "5px 0 0 0", opacity: 0.9 }}>
      Sistema de monitoreo y seguridad industrial
    </p>
  </div>
);
