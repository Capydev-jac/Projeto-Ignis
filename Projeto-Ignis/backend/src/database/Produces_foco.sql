-- ✅ PROCEDURE 1: Inserir foco de calor
CREATE OR REPLACE PROCEDURE inserir_foco_calor(
  p_estado_id INT,
  p_bioma_id INT,
  p_data DATE,
  p_risco_fogo NUMERIC,
  p_dia_sem_chuva TEXT,
  p_precipitacao TEXT,
  p_frp TEXT,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO foco_calor (
    estado_id, bioma_id, data, risco_fogo,
    dia_sem_chuva, precipitacao, frp,
    geometria
  )
  VALUES (
    p_estado_id, p_bioma_id, p_data, p_risco_fogo,
    p_dia_sem_chuva, p_precipitacao, p_frp,
    ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)
  );
END;
$$;


-- ✅ PROCEDURE 2: Gerar relatório de focos por estado
CREATE TABLE IF NOT EXISTS relatorio_focos_estado (
  estado TEXT,
  total_focos INT
);

CREATE OR REPLACE PROCEDURE gerar_relatorio_focos_estado(
  p_data_inicio DATE,
  p_data_fim DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM relatorio_focos_estado;

  INSERT INTO relatorio_focos_estado (estado, total_focos)
  SELECT
    e.estado,
    COUNT(*) AS total
  FROM foco_calor f
  JOIN estados e ON f.estado_id = e.id_estado
  WHERE f.data BETWEEN p_data_inicio AND p_data_fim
  GROUP BY e.estado;
END;
$$;
