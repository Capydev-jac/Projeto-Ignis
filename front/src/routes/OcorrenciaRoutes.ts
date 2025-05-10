import { Router } from "express";
import OcorrenciaController from "../controllers/OcorrenciaController";

const router = Router();

router.get("/risco", OcorrenciaController.Filtrar_risco_fogo);
router.get("/foco_calor", OcorrenciaController.Filtrar_foco_calor);
router.get("/area_queimada", OcorrenciaController.Filtrar_area_queimada);

export default router;
