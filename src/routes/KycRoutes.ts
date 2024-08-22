import { Router } from "express";
import AuthorizationController from "../controllers/AuthorizationController";
import { checkRole } from "../middlewares/userChecker";

const router = Router();

router.post('/bvn', checkRole('USER'), AuthorizationController.checkBVN)

export default router