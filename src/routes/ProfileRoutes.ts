import { Router } from "express";
import ProfileController from "../controllers/ProfileController";
import { checkRole } from "../middlewares/userChecker";

const profileRouter = Router();

profileRouter.post('/create', checkRole('USER'), ProfileController.addProfile)
profileRouter.get('/get', checkRole('USER'), ProfileController.getProfile)


export default profileRouter