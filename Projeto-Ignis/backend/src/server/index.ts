import app from './server'; // ← CORRETO
import dotenv from "dotenv";
import  conecao  from "../database/db";


//sobe o servidor na porta especificada
dotenv.config();

const port = process.env.PORT || 3000;

conecao.connect()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar com o banco:", err);
  });
