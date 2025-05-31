import { BaseDado } from './BaseDado';

export interface MapaProps {
  tipo:'risco' | 'foco_calor' | 'area_queimada' | '';
  dados: BaseDado[];
}
