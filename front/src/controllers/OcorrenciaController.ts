import { Request, Response } from "express";
import { query } from "../server/db";

class OcorrenciaController {
  public async Filtrar_risco_fogo(req: Request, res: Response): Promise<void> {
    try {
      const r = await query(`
       SELECT
    ST_Y(r.geometria) AS latitude,
    ST_X(r.geometria) AS longitude,
    e.estado AS estado,
    b.bioma AS bioma,
    r.risco_fogo,
    r.data
    FROM Risco r
    JOIN Estados e ON r.estado_id = e.id_estado
    JOIN Bioma b ON r.bioma_id = b.id;
      `);
      res.json(r);
    } catch (err: any) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ erro: "Erro ao buscar dados", detalhes: err.message });
    }
  }
  public async Filtrar_foco_calor(req: Request, res: Response): Promise<void> {
    try {
      const r = await query(`
   SELECT
    ST_Y(f.geometria) AS latitude,
    ST_X(f.geometria) AS longitude,
    e.estado AS estado,
    b.bioma AS bioma,
    f.risco_fogo,
    f.data,
    f.dia_sem_chuva,
    f.precipitacao,
    f.frp
  FROM Foco_calor f
  JOIN Estados e ON f.estado_id = e.id_estado
  JOIN Bioma b ON f.bioma_id = b.id;
      `);
      res.json(r);
    } catch (err: any) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ erro: "Erro ao buscar dados", detalhes: err.message });
    }
  }

}

export default new OcorrenciaController();
