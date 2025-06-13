-- Trigger 1: Auditar inserções na tabela foco_calor
--Crie um arquivo SQL: triggers_projeto_ignis.sql
--Execute no PostgreSQL via pgAdmin, DBeaver, ou CLI (psql)
--As triggers agem automaticamente, sem precisar alterar seu backend
--Cria um histórico automático sempre que um novo foco de calor é inserido.

-- Tabela de auditoria
CREATE TABLE IF NOT EXISTS foco_calor_auditoria (
  id SERIAL PRIMARY KEY,
  foco_id INT,
  estado_id INT,
  bioma_id INT,
  data TIMESTAMP,
  operacao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Função da trigger
CREATE OR REPLACE FUNCTION log_insercao_foco_calor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO foco_calor_auditoria (
    foco_id, estado_id, bioma_id, data, operacao
  )
  VALUES (
    NEW.id, NEW.estado_id, NEW.bioma_id, NEW.data, 'INSERÇÃO'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger em foco_calor
CREATE TRIGGER trigger_log_foco_calor
AFTER INSERT ON foco_calor
FOR EACH ROW
EXECUTE FUNCTION log_insercao_foco_calor();

--Trigger 2: Garantir data mínima válida na tabela risco
--Impede que dados de risco de fogo sejam registrados com datas anteriores a 2020.
-- Função da trigger

CREATE OR REPLACE FUNCTION validar_data_risco()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.data < '2020-01-01' THEN
    RAISE EXCEPTION '❌ Data inválida: não são aceitos registros anteriores a 2020';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger na tabela de risco
CREATE TRIGGER trigger_validar_data_risco
BEFORE INSERT ON risco
FOR EACH ROW
EXECUTE FUNCTION validar_data_risco();
