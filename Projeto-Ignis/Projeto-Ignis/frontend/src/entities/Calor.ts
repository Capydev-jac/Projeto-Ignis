export class Foco_calor {
    id: number;
    data: Date;
    geometria: any; // geometry(point, 4326)
    estado_id: number;
    bioma_id: number;
    risco_fogo: number;
    dia_sem_chuva: number;
    precipitacao: number;
    frp: number;
  
    constructor(
      id: number,
      data: Date,
      geometria: any,
      estado_id: number,
      bioma_id: number,
      risco_fogo: number,
      dia_sem_chuva: number,
      precipitacao: number,
      frp: number
    ) {
      this.id = id;
      this.data = data;
      this.geometria = geometria;
      this.estado_id = estado_id;
      this.bioma_id = bioma_id;
      this.risco_fogo = risco_fogo;
      this.dia_sem_chuva = dia_sem_chuva;
      this.precipitacao = precipitacao;
      this.frp = frp;
    }
  }
  
