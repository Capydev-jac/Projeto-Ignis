// routes/ocorrencia.routes.ts
import { Router } from "express";
import OcorrenciaController from "../controllers/OcorrenciaController";

const router = Router();

// 🌡️ Rota para risco de fogo com filtros opcionais
router.get("/risco", OcorrenciaController.Filtrar_risco_fogo);

// 🔥 Rota para foco de calor com filtros opcionais
router.get("/foco_calor", OcorrenciaController.Filtrar_foco_calor);

// 🔥 Rota para área queimada com filtros opcionais
router.get("/area_queimada", OcorrenciaController.Filtrar_area_queimada);

export default router;
