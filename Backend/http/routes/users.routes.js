import {Router} from 'express';
import { recommendationController } from '../controllers/recommendation.controller.js';
import { healthAssistantController } from "../controllers/assistant.controller.js";

const router = Router();
router.post('/recommendation',recommendationController);
router.post("/assistant", healthAssistantController);
//router.post('/update/bp',)
export default router;
