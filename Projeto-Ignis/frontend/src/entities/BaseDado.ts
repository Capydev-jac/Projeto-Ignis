export interface BaseDado {
  latitude?: number;
  longitude?: number;
  estado?: string | number;
  bioma?: string | number;
  risco_fogo?: number;
  data: string;
  frp?: number;
  dia_sem_chuva?: string;
  precipitacao?: number;
  tipo: 'risco' | 'foco_calor' | 'area_queimada';
  media?: number;
  total?: number;
  geometria?: GeoJSON.FeatureCollection; // ✅ Aqui corrige
}