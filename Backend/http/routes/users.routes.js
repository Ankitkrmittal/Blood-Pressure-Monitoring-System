import {Router} from 'express';
import { recommendationController } from '../controllers/recommendation.controller.js';

const router = Router();
router.post('/recommendation',recommendationController);
//router.post('/update/bp',)
export default router;
