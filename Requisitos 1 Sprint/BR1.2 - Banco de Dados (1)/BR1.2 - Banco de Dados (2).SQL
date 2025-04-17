SELECT estados.nome_estado, COUNT(biomas.id_bioma) AS qtd_biomas
FROM estados
INNER JOIN biomas ON estados.id_estado = biomas.id_estado
GROUP BY estados.nome_estado;
