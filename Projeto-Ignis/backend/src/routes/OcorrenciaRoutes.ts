import { Router } from "express";
import OcorrenciaController from "../controllers/OcorrenciaController";

const router = Router();

router.get('/datas_disponiveis', OcorrenciaController.DatasDisponiveis);

// 🔥 Rota para mapa
router.get("/risco", OcorrenciaController.Filtrar_Risco);
router.get("/foco_calor", OcorrenciaController.Filtrar_foco_calor);
router.get("/area_queimada", OcorrenciaController.Filtrar_area_queimada);
router.post("/inserir-foco", OcorrenciaController.InserirFocoCalor);
router.get("/relatorio-focos", OcorrenciaController.GerarRelatorioFocos);

// 📊 ROTAS DE GRÁFICO
router.get("/grafico/area_queimada", OcorrenciaController.GraficoAreaQueimada);
router.get("/grafico/risco", OcorrenciaController.GraficoRiscoFogo);
router.get("/grafico/foco_calor", OcorrenciaController.GraficoFocoCalor);

export default router;
