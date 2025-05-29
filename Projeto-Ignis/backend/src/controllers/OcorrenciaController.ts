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
  tipo?: string;
}

// 🔥 Função para validar intervalo de datas
const diffDias = (inicio: string, fim: string) => {
  const i = new Date(inicio);
  const f = new Date(fim);
  const diff = (f.getTime() - i.getTime()) / (1000 * 3600 * 24);
  return diff;
};

class OcorrenciaController {
  // 🔥 RISCO DE FOGO
  public async Filtrar_risco_fogo(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      if (!inicio || !fim) {
        res.status(400).json({ erro: "Informe o intervalo de datas (início e fim)." });
        return;
      }

      if (diffDias(inicio as string, fim as string) > 60) {
        res.status(400).json({ erro: "O intervalo máximo permitido é de 60 dias." });
        return;
      }

      let baseQuery = `
        SELECT
          ST_Y(r.geometria) AS latitude,
          ST_X(r.geometria) AS longitude,
          e.estado,
          b.bioma,
          CAST(r.risco_fogo AS FLOAT) AS risco_fogo,
          r.data,
          'risco' AS tipo
        FROM Risco r
        JOIN Estados e ON r.estado_id = e.id_estado
        JOIN Bioma b ON r.bioma_id = b.id
        WHERE r.data BETWEEN $1 AND $2
      `;

      const values: any[] = [inicio, fim];

      if (estado) {
        baseQuery += ` AND r.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        baseQuery += ` AND r.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      baseQuery += ' LIMIT 10000';

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao buscar risco de fogo", detalhes: err.message });
    }
  }

  // 🔥 ÁREA QUEIMADA
  public async Filtrar_area_queimada(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      if (!inicio || !fim) {
        res.status(400).json({ erro: "Informe o intervalo de datas (início e fim)." });
        return;
      }

      if (diffDias(inicio as string, fim as string) > 60) {
        res.status(400).json({ erro: "O intervalo máximo permitido é de 60 dias." });
        return;
      }

      let baseQuery = `
        SELECT
          ST_Y(a.geom) AS latitude,
          ST_X(a.geom) AS longitude,
          e.estado,
          b.bioma,
          a.risco AS risco_fogo,
          a.data_pas AS data,
          a.frp,
          a.tipo
        FROM Area_Queimada a
        JOIN Estados e ON a.estado_id = e.id_estado
        JOIN Bioma b ON a.bioma_id = b.id
        WHERE a.data_pas BETWEEN $1 AND $2
      `;

      const values: any[] = [inicio, fim];

      if (estado) {
        baseQuery += ` AND a.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        baseQuery += ` AND a.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      baseQuery += ' LIMIT 10000';

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao buscar área queimada", detalhes: err.message });
    }
  }

  // 🔥 FOCO DE CALOR
  public async Filtrar_foco_calor(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      if (!inicio || !fim) {
        res.status(400).json({ erro: "Informe o intervalo de datas (início e fim)." });
        return;
      }

      if (diffDias(inicio as string, fim as string) > 60) {
        res.status(400).json({ erro: "O intervalo máximo permitido é de 60 dias." });
        return;
      }

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
        WHERE f.data BETWEEN $1 AND $2
      `;

      const values: any[] = [inicio, fim];

      if (estado) {
        baseQuery += ` AND f.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        baseQuery += ` AND f.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      baseQuery += ' LIMIT 10000';

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao buscar foco de calor", detalhes: err.message });
    }
  }


  // 📊 GRÁFICO DE ÁREA QUEIMADA
  public async GraficoAreaQueimada(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim, local } = req.query;

      const agrupamento = local === 'bioma' ? 'b.bioma' : 'e.estado';

      let queryStr = `
        SELECT 
          ${agrupamento} AS categoria,
          COUNT(*) AS total
        FROM Area_Queimada a
        JOIN Estados e ON a.estado_id = e.id_estado
        JOIN Bioma b ON a.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        queryStr += ` AND a.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        queryStr += ` AND a.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      if (inicio) {
        queryStr += ` AND a.data_pas >= $${values.length + 1}`;
        values.push(inicio);
      }

      if (fim) {
        queryStr += ` AND a.data_pas <= $${values.length + 1}`;
        values.push(fim);
      }

      queryStr += ` GROUP BY categoria ORDER BY total DESC`;

      const resultado = await query(queryStr, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao gerar gráfico de área queimada", detalhes: err.message });
    }
  }

  // 📊 GRÁFICO DE RISCO DE FOGO
  public async GraficoRiscoFogo(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim, local } = req.query;

      const agrupamento = local === 'bioma' ? 'b.bioma' : 'e.estado';

      let queryStr = `
        SELECT 
          ${agrupamento} AS categoria,
          ROUND(AVG(r.risco_fogo), 2) AS total
        FROM Risco r
        JOIN Estados e ON r.estado_id = e.id_estado
        JOIN Bioma b ON r.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        queryStr += ` AND r.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        queryStr += ` AND r.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      if (inicio) {
        queryStr += ` AND r.data >= $${values.length + 1}`;
        values.push(inicio);
      }

      if (fim) {
        queryStr += ` AND r.data <= $${values.length + 1}`;
        values.push(fim);
      }

      queryStr += ` GROUP BY categoria ORDER BY total DESC`;

      const resultado = await query(queryStr, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao gerar gráfico de risco de fogo", detalhes: err.message });
    }
  }

  // 📊 GRÁFICO DE FOCO DE CALOR
  public async GraficoFocoCalor(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim, local } = req.query;

      const agrupamento = local === 'bioma' ? 'b.bioma' : 'e.estado';

      let queryStr = `
        SELECT 
          ${agrupamento} AS categoria,
          ROUND(AVG(f.frp), 1) AS total
        FROM Foco_Calor f
        JOIN Estados e ON f.estado_id = e.id_estado
        JOIN Bioma b ON f.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        queryStr += ` AND f.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }

      if (bioma) {
        queryStr += ` AND f.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }

      if (inicio) {
        queryStr += ` AND f.data >= $${values.length + 1}`;
        values.push(inicio);
      }

      if (fim) {
        queryStr += ` AND f.data <= $${values.length + 1}`;
        values.push(fim);
      }

      queryStr += ` GROUP BY categoria ORDER BY total DESC`;

      const resultado = await query(queryStr, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao gerar gráfico de foco de calor", detalhes: err.message });
    }
  }

  // 📅 DATAS DISPONÍVEIS
  public async DatasDisponiveis(req: Request, res: Response): Promise<void> {
    try {
      const { tipo } = req.query;

      // Mapeamento correto das tabelas e colunas
      const config: Record<string, { tabela: string; coluna: string }> = {
        risco: { tabela: "Risco", coluna: "data" },
        foco_calor: { tabela: "Foco_calor", coluna: "data" },
        area_queimada: { tabela: "Area_Queimada", coluna: "data_pas" },
      };

      const tipoConfig = config[String(tipo)];
      if (!tipoConfig) {
        res.status(400).json({ erro: "Tipo inválido. Use risco, foco_calor ou area_queimada." });
        return;
      }

      // Query para datas distintas ordenadas
      const queryDatas = `
  SELECT DISTINCT TO_CHAR(${tipoConfig.coluna}, 'YYYY-MM-DD') AS data 
  FROM ${tipoConfig.tabela} 
  WHERE ${tipoConfig.coluna} IS NOT NULL
  ORDER BY data
`;

      const rows = await query(queryDatas); // ← agora acessamos o array direto

      if (!rows || rows.length === 0) {
        res.status(404).json({ erro: "Nenhum dado encontrado." });
        return;
      }

      const datas = rows.map((row: any) =>
        new Date(row.data).toISOString().split("T")[0]
      );

      res.json({
        min: datas[0],
        max: datas[datas.length - 1],
        datas_disponiveis: datas,
      });
    } catch (error: any) {
      res.status(500).json({
        erro: "Erro ao buscar datas disponíveis",
        detalhes: error.message,
      });
    }
  }
}



export default new OcorrenciaController();
