import { FiltrosBase } from "./FiltrosBase";

export interface FiltrosGrafico extends FiltrosBase {
  local: 'estado' | 'bioma';
  tipo: string
  
}