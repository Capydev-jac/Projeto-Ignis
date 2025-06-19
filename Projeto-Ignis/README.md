Lembretes:

1- npm install na raiz do projeto

_________________________________________________

1- npm run init :criar o banco de dados (tabelas e inserção).
  - Excluir o as tabelas (Estados, Biomas e Risco) que vai ser criada pelo init
  - Colocar os arquivos que estão na pasta BancoIgnis (Criar tabelas e inserts)
  - Abrir a pasta "Sem Zero" e colocar o arquivo CSV no diretorio C:\ (caso queira alterar o diretorio precisa mudar no insert)
  - Coloque o script do loader no PostGREE e rode para copiar os dados.

2- npm run dev : inicia o servidor (back e front)

__________________________________________________

é necessario sempre ter o arquivo .env no backend:

PGHOST=localhost
PGUSER=postgres
PGPASSWORD="123"
PGDATABASE=postgres
PGPORT=5432
