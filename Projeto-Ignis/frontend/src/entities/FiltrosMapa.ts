import { FiltrosBase } from "./FiltrosBase";

export interface FiltrosMapa extends FiltrosBase {
  tipo: '' | 'risco' | 'foco_calor' | 'area_queimada';
}