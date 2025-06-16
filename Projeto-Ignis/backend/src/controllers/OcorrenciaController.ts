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
  // 🔥 RISCO DE FOGO AGRUPADO DINÂMICO
  public async Filtrar_Risco(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, data, local } = req.query;

      if (!data) {
        res.status(400).json({ erro: "Informe a data no formato YYYY-MM-DD" });
        return;
      }

      const filtros = [];
      const valores: any[] = [];

      if (estado) {
        filtros.push(`estado_id = $${valores.length + 1}`);
        valores.push(estado);
      }
      if (bioma) {
        filtros.push(`bioma_id = $${valores.length + 1}`);
        valores.push(bioma);
      }
      filtros.push(`data = $${valores.length + 1}`);
      valores.push(data);

      const whereClause = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

      // 🔥 Agrupar por estado ou bioma
      const agrupamento = local === 'bioma' ? 'bioma_id' : 'estado_id';

      const sql = `
        SELECT 
          ${agrupamento} AS agrupamento,
          AVG(risco_fogo) AS media_risco,
          COUNT(*) AS total_pontos
        FROM risco
        ${whereClause}
        GROUP BY ${agrupamento}
      `;

      console.log('🟢 Query SQL:', sql);
      console.log('🟢 Valores:', valores);

      const resultado = await query(sql, valores);

      const resposta = resultado.map((item: any) => ({
        estado: agrupamento === 'estado_id' ? Number(item.agrupamento) : undefined,
        bioma: agrupamento === 'bioma_id' ? Number(item.agrupamento) : undefined,
        media: item.media_risco !== null ? Number(item.media_risco) : 0,
        total: item.total_pontos ? Number(item.total_pontos) : 0
      }));

      res.json(resposta);
    } catch (error) {
      console.error("❌ Erro na consulta de risco:", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }

  // 🔥 FOCO DE CALOR
  public async Filtrar_Foco(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      if (!inicio || !fim) {
        res.status(400).json({ erro: "Informe o intervalo de datas (início e fim)" });
        return;
      }

      const filtros = [];
      const valores: any[] = [];

      if (estado) {
        filtros.push(`estado_id = $${valores.length + 1}`);
        valores.push(estado);
      }
      if (bioma) {
        filtros.push(`bioma_id = $${valores.length + 1}`);
        valores.push(bioma);
      }

      filtros.push(`data BETWEEN $${valores.length + 1} AND $${valores.length + 2}`);
      valores.push(inicio, fim);

      const whereClause = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

      const sql = `
        SELECT 
          ST_Y(geometria) AS latitude,
          ST_X(geometria) AS longitude,
          estado_id,
          bioma_id,
          risco_fogo,
          data,
          dia_sem_chuva,
          precipitacao,
          frp
        FROM foco_calor
        ${whereClause}
      `;

      const resultado = await query(sql, valores);

      const resposta = resultado.map((item: any) => ({
        latitude: item.latitude,
        longitude: item.longitude,
        estado: item.estado_id,
        bioma: item.bioma_id,
        risco_fogo: item.risco_fogo,
        data: item.data,
        dia_sem_chuva: item.dia_sem_chuva,
        precipitacao: item.precipitacao,
        frp: item.frp
      }));

      res.json(resposta);
    } catch (error) {
      console.error("❌ Erro na consulta de foco de calor:", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }

  // 🔥 ÁREA QUEIMADA
  public async Filtrar_AreaQueimada(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      if (inicio && !fim) {
        // 🔥 Quando é apenas o mês → serve um arquivo GeoJSON pronto
        res.sendFile(`area_queimada_${inicio}.geojson`, { root: 'public/geojson/area_queimada' });
        return;
      }

      if (!inicio || !fim) {
        res.status(400).json({ erro: "Informe o intervalo de datas (início e fim)" });
        return;
      }

      const filtros = [];
      const valores: any[] = [];

      if (estado) {
        filtros.push(`estado_id = $${valores.length + 1}`);
        valores.push(estado);
      }
      if (bioma) {
        filtros.push(`bioma_id = $${valores.length + 1}`);
        valores.push(bioma);
      }

      filtros.push(`data_pas BETWEEN $${valores.length + 1} AND $${valores.length + 2}`);
      valores.push(inicio, fim);

      const whereClause = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

      const sql = `
        SELECT 
          ST_Y(geom) AS latitude,
          ST_X(geom) AS longitude,
          estado_id,
          bioma_id,
          risco AS risco_fogo,
          data_pas AS data
        FROM area_queimada
        ${whereClause}
      `;

      const resultado = await query(sql, valores);

      const resposta = resultado.map((item: any) => ({
        latitude: item.latitude,
        longitude: item.longitude,
        estado: item.estado_id,
        bioma: item.bioma_id,
        risco_fogo: item.risco_fogo,
        data: item.data
      }));

      res.json(resposta);
    } catch (error) {
      console.error("❌ Erro na consulta de área queimada:", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }

  // 🔥 ÁREA QUEIMADA
  async  Filtrar_area_queimada(req: Request, res: Response): Promise<void> {
  try {
    const { estado_id, bioma_id } = req.query;

    const filtros = [];
    const valores: any[] = [];

    if (estado_id) {
      filtros.push(`estado_id = $${valores.length + 1}`);
      valores.push(estado_id);
    }

    if (bioma_id) {
      filtros.push(`bioma_id = $${valores.length + 1}`);
      valores.push(bioma_id);
    }

    const where = filtros.length > 0 ? `WHERE ${filtros.join(' AND ')}` : '';

    const sql = `
      SELECT id, risco_fogo, estado_id, bioma_id, data,
             ST_X(geometria) AS longitude,
             ST_Y(geometria) AS latitude
      FROM risco
      ${where};
    `;

    const result = await query(sql, valores);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar áreas de risco de fogo:', error);
    res.status(500).json({ erro: 'Erro ao buscar áreas de risco de fogo' });
  }
};


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
  ${local === 'bioma' ? 'bioma_id' : 'estado_id'} AS local,
  COUNT(*) AS total_pontos
FROM area_queimada
WHERE data_pas BETWEEN $1 AND $2
GROUP BY ${local === 'bioma' ? 'bioma_id' : 'estado_id'};
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
  public async GraficoRiscoFogo(req: Request, res: Response) {
  try {
    const { inicio, fim, local } = req.query;

    if (!inicio || !fim) {
      res.status(400).json({ erro: "Informe o intervalo de datas (inicio e fim) no formato YYYY-MM-DD" });
      return;
    }

    const agrupamento = local === 'bioma' ? 'bioma_id' : 'estado_id';

    const sql = `
      SELECT 
        ${agrupamento} AS local,
        ROUND(AVG(risco_fogo)::numeric, 2) AS media,
        COUNT(*) AS total
      FROM risco
      WHERE data BETWEEN $1 AND $2
      GROUP BY ${agrupamento}
    `;

    const resultado = await query(sql, [inicio, fim]);

    res.json(resultado);
  } catch (error) {
    console.error("Erro no gráfico de risco:", error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
}

  // 📊 GRÁFICO DE FOCO DE CALOR
  public async GraficoFocoCalor(req: Request, res: Response) {
    try {
      const { inicio, fim, local } = req.query;

      if (!inicio || !fim) {
        res.status(400).json({ erro: "Informe o intervalo de datas (inicio e fim) no formato YYYY-MM-DD" });
        return;
      }

      const agrupamento = local === "bioma" ? "bioma_id" : "estado_id";

      const sql = `
        SELECT 
          ${agrupamento} AS local,
          COUNT(*) AS total
        FROM foco_calor
        WHERE data BETWEEN $1 AND $2
        GROUP BY ${agrupamento}
        ORDER BY total DESC
      `;

      const valores = [inicio, fim];
      const resultado = await query(sql, valores);

      res.json(resultado);
    } catch (error: any) {
      console.error("❌ Erro no gráfico de foco de calor:", error);
      res.status(500).json({ erro: "Erro interno no servidor" });
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
