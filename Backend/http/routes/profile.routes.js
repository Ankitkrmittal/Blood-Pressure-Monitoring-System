import { Router } from "express";
import { editProfile } from "../controllers/profile.controller.js";
const router = Router();
router.post('/',editProfile)

export default router;