export class Area_Queimada {
    id: number;
    data: Date;
    geometria: any; // geometry(point, 4326)
    estado_id: number;
    bioma_id: number;
    frp: number;
  
    constructor(
      id: number,
      data: Date,
      geometria: any,
      estado_id: number,
      bioma_id: number,
      frp: number
    ) {
      this.id = id;
      this.data = data;
      this.geometria = geometria;
      this.estado_id = estado_id;
      this.bioma_id = bioma_id;
      this.frp = frp;
    }
  }
  
