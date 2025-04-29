import { Request, Response } from "express";
import { query } from "../server/db"; // Verifique se o caminho está correto para o seu arquivo de banco de dados

// Definição da interface ResultadoQuery para tipar corretamente os dados retornados
interface ResultadoQuery {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  dia_sem_chuva?: string;      // Propriedade opcional para foco_calor
  precipitacao?: string;       // Propriedade opcional para foco_calor
  frp?: string;                // Propriedade opcional para foco_calor
}

// Definindo a classe OcorrenciaController
class OcorrenciaController {
  // Função para filtrar dados da tabela Risco
  public async Filtrar_risco_fogo(req: Request, res: Response): Promise<void> {
    try {
      const r: ResultadoQuery[] = await query(`
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
      res.json(r); // Retorna os dados da consulta para o frontend
    } catch (err: any) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ erro: "Erro ao buscar dados", detalhes: err.message });
    }
  }

  // Função para filtrar dados da tabela Foco_calor
  public async Filtrar_foco_calor(req: Request, res: Response): Promise<void> {
    try {
      const r: ResultadoQuery[] = await query(`
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
      res.json(r); // Retorna os dados da consulta para o frontend
    } catch (err: any) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ erro: "Erro ao buscar dados", detalhes: err.message });
    }
  }

  // Função para filtrar dados da tabela Area_Queimada
  public async Filtrar_area_queimada(req: Request, res: Response): Promise<void> {
    try {
      const r: ResultadoQuery[] = await query(`
        SELECT
          ST_Y(a.geom) AS latitude,    -- Pega a latitude a partir do campo geom
          ST_X(a.geom) AS longitude,   -- Pega a longitude a partir do campo geom
          e.estado AS estado,          -- Nome do estado
          b.bioma AS bioma,            -- Nome do bioma
          a.risco AS risco_fogo,       -- Risco de fogo (renomeado para compatibilidade com o frontend)
          a.data_pas AS data,          -- Data da ocorrência
          a.frp                       -- Potência radiativa do fogo
        FROM Area_Queimada a
        JOIN Estados e ON a.estado_id = e.id_estado
        JOIN Bioma b ON a.bioma_id = b.id;
      `);
      res.json(r); // Retorna os dados da consulta para o frontend
    } catch (err: any) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ erro: "Erro ao buscar dados", detalhes: err.message });
    }
  }
}

// Exportando a instância da classe OcorrenciaController
export default new OcorrenciaController();
