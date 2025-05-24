import { Router } from "express";
import OcorrenciaController from "../controllers/OcorrenciaController";

const router = Router();

// 🔥 Rota para mapa
router.get("/risco", OcorrenciaController.Filtrar_risco_fogo);
router.get("/foco_calor", OcorrenciaController.Filtrar_foco_calor);
router.get("/area_queimada", OcorrenciaController.Filtrar_area_queimada);

// 📊 ROTAS DE GRÁFICO
router.get("/grafico/area_queimada", OcorrenciaController.GraficoAreaQueimada);
router.get("/grafico/risco", OcorrenciaController.GraficoRiscoFogo);
router.get("/grafico/foco_calor", OcorrenciaController.GraficoFocoCalor);

export default router;