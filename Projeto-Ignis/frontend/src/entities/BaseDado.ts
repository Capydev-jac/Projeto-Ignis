export interface BaseDado {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  dia_sem_chuva?: string;
  precipitacao?: number;
  frp?: number;
  tipo: 'risco' | 'foco' | 'area_queimada';
  media: number
}
