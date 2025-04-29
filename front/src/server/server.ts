import express from "express";
import cors from "cors";
import pool from "../server/db";
import ocorrenciaRoutes from "../routes/OcorrenciaRoutes";

// Conexão com o banco
pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const server = express();

// ✅ Habilita o CORS para qualquer origem
server.use(cors());

server.use(express.json());

// Prefixo /api para suas rotas
server.use("/api", ocorrenciaRoutes);

// Teste de rota viva
server.get("/api", (_, res) => {
  res.send("API está funcionando!");
});

server.get("/", (_, res) => {
  res.send("Hello HypoHeat!");
});

export { server };
