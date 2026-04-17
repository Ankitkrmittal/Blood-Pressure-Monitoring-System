import { Router } from "express";
import { healthAssistantController } from "../controllers/assistant.controller.js";

const router = Router();
router.post("/assistant", healthAssistantController);

export default router;
