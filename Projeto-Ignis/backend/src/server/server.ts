import express from "express";
import cors from "cors";
import ocorrenciaRoutes from "../routes/OcorrenciaRoutes";

const server = express();

// Habilita CORS para todas as origens
server.use(cors());

// Permite o uso de JSON no corpo das requisições
server.use(express.json());

// Rotas da API
server.use("/api", ocorrenciaRoutes);

// Rota de teste simples
server.get("/", (_, res) => {
  res.send("API do Projeto Ignis está ativa!");
});

export { server };