export interface FeatureProperties {
  tipo?: string;
  categoria?: string;
  confianza?: number;
  riesgo?: 'ALTO' | 'MEDIO' | 'BAJO';
  nivel?: string;
  descripcion?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon';
    coordinates: any;
  };
  properties: FeatureProperties;
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface Stats {
  personas: number;
  vehiculos: number;
  zonas: number;
}