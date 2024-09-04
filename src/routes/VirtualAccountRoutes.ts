import { Router } from "express";
import VirtualAccountController from "../controllers/VirtualAccountController";
import { checkRole } from "../middlewares/userChecker";

const virtualAccountRouter = Router();

virtualAccountRouter.post('/create', checkRole('USER'), VirtualAccountController.createVirtualAccount)
virtualAccountRouter.get('/get', checkRole('USER'), VirtualAccountController.getVirtualAccount)


export default virtualAccountRouter