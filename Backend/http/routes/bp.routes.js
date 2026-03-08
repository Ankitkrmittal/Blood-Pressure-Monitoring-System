import  {Router} from 'express';
import { addBPReading } from '../controllers/bp.controller.js';
const router = Router();
router.post('/bp',addBPReading);
export default router;