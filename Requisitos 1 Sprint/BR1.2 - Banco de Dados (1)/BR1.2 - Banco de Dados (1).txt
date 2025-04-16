SELECT estados.nome_estado, biomas.nome_bioma
FROM estados
INNER JOIN biomas ON estados.id_estado = biomas.id_estado;
