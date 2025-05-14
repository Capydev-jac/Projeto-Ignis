import { Request, Response } from "express";
import { query } from "../database/db";

interface ResultadoQuery {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  dia_sem_chuva?: string;
  precipitacao?: string;
  frp?: string;
}

class OcorrenciaController {
  // 🔥 RISCO DE FOGO
  public async Filtrar_risco_fogo(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      console.log("Filtros recebidos:");
      console.log("estado:", estado);
      console.log("bioma:", bioma);
      console.log("inicio:", inicio);
      console.log("fim:", fim);

      let baseQuery = `
        SELECT
          ST_Y(r.geometria) AS latitude,
          ST_X(r.geometria) AS longitude,
          e.estado,
          b.bioma,
          r.risco_fogo,
          r.data
        FROM Risco r
        JOIN Estados e ON r.estado_id = e.id_estado
        JOIN Bioma b ON r.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        baseQuery += ` AND r.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        baseQuery += ` AND r.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      if (inicio) {
        baseQuery += ` AND r.data >= $${values.length + 1}`;
        values.push(inicio);
      }

      if (fim) {
        baseQuery += ` AND r.data <= $${values.length + 1}`;
        values.push(fim);
      }

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);

    } catch (err: any) {
      console.error("Erro ao buscar risco de fogo:", err);
      res.status(500).json({ erro: "Erro ao buscar risco de fogo", detalhes: err.message });
    }
  }

  // 🔥 ÁREA QUEIMADA
  public async Filtrar_area_queimada(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      console.log("Filtros recebidos:");
      console.log("estado:", estado);
      console.log("bioma:", bioma);
      console.log("inicio:", inicio);
      console.log("fim:", fim);

      let baseQuery = `
       SELECT
  ST_Y(a.geom) AS latitude,
  ST_X(a.geom) AS longitude,
  e.estado,
  b.bioma,
  a.risco AS risco_fogo,
  a.data_pas AS data,
  a.frp,
  a.tipo -- ← já vem da tabela
FROM Area_Queimada a
JOIN Estados e ON a.estado_id = e.id_estado
JOIN Bioma b ON a.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        baseQuery += ` AND a.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        baseQuery += ` AND a.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      if (inicio) {
        baseQuery += ` AND a.data_pas >= $${values.length + 1}`;
        values.push(inicio);
      }

      if (fim) {
        baseQuery += ` AND a.data_pas <= $${values.length + 1}`;
        values.push(fim);
      }

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);

    } catch (err: any) {
      console.error("Erro ao buscar área queimada:", err);
      res.status(500).json({ erro: "Erro ao buscar área queimada", detalhes: err.message });
    }
  }

  // 🔥 FOCO DE CALOR
  public async Filtrar_foco_calor(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      console.log("Filtros recebidos:");
      console.log("estado:", estado);
      console.log("bioma:", bioma);
      console.log("inicio:", inicio);
      console.log("fim:", fim);

      let baseQuery = `
        SELECT
          ST_Y(f.geometria) AS latitude,
          ST_X(f.geometria) AS longitude,
          e.estado,
          b.bioma,
          f.risco_fogo AS risco_fogo,
          f.data AS data,
          f.dia_sem_chuva AS dia_sem_chuva,
          f.precipitacao,
          f.frp
        FROM Foco_Calor f
        JOIN Estados e ON f.estado_id = e.id_estado
        JOIN Bioma b ON f.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        baseQuery += ` AND f.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        baseQuery += ` AND f.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      if (inicio) {
        baseQuery += ` AND f.data_hora_t3 >= $${values.length + 1}`;
        values.push(inicio);
      }

      if (fim) {
        baseQuery += ` AND f.data_hora_t3 <= $${values.length + 1}`;
        values.push(fim);
      }

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);

    } catch (err: any) {
      console.error("Erro ao buscar foco de calor:", err);
      res.status(500).json({ erro: "Erro ao buscar foco de calor", detalhes: err.message });
    }
  }
}

export default new OcorrenciaController();
