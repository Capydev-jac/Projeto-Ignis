import { Request, Response } from "express";
import { query } from "../database/db";
import path from "path";
import fs from "fs";


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

      if (diffDias(inicio as string, fim as string) > 100) {
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
  async  Filtrar_area_queimada(req: Request, res: Response): Promise<void> {
  try {
    const { estado, bioma, inicio, fim } = req.query;

    // Se houver apenas o mês (inicio) e não houver fim, busca o arquivo estático
    if (inicio && !fim) { 
      const filePath = path.join(__dirname, '../../public/geojson/area_queimada', `${inicio}.geojson`);
      console.log('📂 Procurando arquivo em:', filePath);
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ erro: 'Arquivo não encontrado para o mês informado.' });
        return;
      }

      const geojson = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.parse(geojson));
      return;
    }

    // Lógica tradicional com início e fim (mantém como está)
    if (!inicio || !fim) {
      res.status(400).json({ erro: "Informe o intervalo de datas (início e fim)." });
      return;
    }

    // 🔁 Aqui continua sua lógica SQL normal se precisar...
    res.status(200).json([]); // Exemplo temporário
  } catch (error) {
    console.error('Erro ao filtrar área queimada:', error);
    res.status(500).json({ erro: 'Erro interno ao processar os dados.' });
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

      if (diffDias(inicio as string, fim as string) > 100) {
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

  //Produce Foco inserir_foco_calor

  public async InserirFocoCalor(req: Request, res: Response): Promise<void> {
  try {
    const {
      estado_id,
      bioma_id,
      data,
      risco_fogo,
      dia_sem_chuva,
      precipitacao,
      frp,
      latitude,
      longitude
    } = req.body;

    const sql = `
      CALL inserir_foco_calor(
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
    `;

    await query(sql, [
      estado_id,
      bioma_id,
      data,
      risco_fogo,
      dia_sem_chuva,
      precipitacao,
      frp,
      latitude,
      longitude
    ]);

    res.status(200).json({ mensagem: '✅ Foco de calor inserido com sucesso via procedure.' });
  } catch (err: any) {
    res.status(500).json({
      erro: '❌ Erro ao inserir foco de calor via procedure',
      detalhes: err.message
    });
  }
}

  // Procedure gerar_relatorio_focos_estado

  public async GerarRelatorioFocos(req: Request, res: Response): Promise<void> {
  try {
    const { inicio, fim } = req.query;

    if (!inicio || !fim) {
      res.status(400).json({ erro: "Informe data inicial e final." });
      return;
    }

    const sql = `CALL gerar_relatorio_focos_estado($1, $2)`;
    await query(sql, [inicio, fim]);

    const resultado = await query('SELECT * FROM relatorio_focos_estado ORDER BY total_focos DESC');
    res.json(resultado);
  } catch (err: any) {
    res.status(500).json({
      erro: 'Erro ao gerar relatório',
      detalhes: err.message
    });
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
          ROUND(COUNT(DISTINCT geometria), 1) AS total
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

    // Configurações por tipo
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

    let queryDatas = "";
    if (tipo === "area_queimada") {
      // Retorna meses (como "02", "03") ordenados corretamente
      queryDatas = `
        SELECT DISTINCT 
          TO_CHAR(${tipoConfig.coluna}, 'MM') AS mes_str,
          CAST(TO_CHAR(${tipoConfig.coluna}, 'MM') AS INTEGER) AS mes_num
        FROM ${tipoConfig.tabela}
        WHERE ${tipoConfig.coluna} IS NOT NULL
        ORDER BY mes_num
      `;
    } else {
      // Retorna datas completas (como "2024-05-01")
      queryDatas = `
        SELECT DISTINCT TO_CHAR(${tipoConfig.coluna}, 'YYYY-MM-DD') AS data
        FROM ${tipoConfig.tabela}
        WHERE ${tipoConfig.coluna} IS NOT NULL
        ORDER BY data
      `;
    }

    const rows = await query(queryDatas);

    let datas: string[] = [];

    if (tipo === "area_queimada") {
      datas = rows
        .map((row: any) => row.mes_str)
        .filter((d: string | null) => d !== null);
    } else {
      datas = rows
        .map((row: any) => row.data)
        .filter((d: string | null) => d !== null)
        .map((d: string) => new Date(d).toISOString().split("T")[0]);
    }

    if (datas.length === 0) {
      res.status(404).json({ erro: "Nenhuma data disponível." });
      return;
    }

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
