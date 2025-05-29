export interface FiltrosGrafico {
  tipo: 'risco' | 'foco_calor' | 'area_queimada';
  local: 'estado' | 'bioma';
  estado: string;
  bioma: string;
  inicio: string;
  fim: string;
}
