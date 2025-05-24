export interface Filtros {
  tipo: 'risco' | 'foco_calor' | 'area_queimada';
  estado: string;
  bioma: string;
  inicio: string;
  fim: string;
  local: 'estado' | 'bioma';
}