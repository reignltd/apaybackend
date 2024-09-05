/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import WalletTypeController from "../controllers/WalletTypeController";
import { checkRole } from "../middlewares/userChecker";

const walletRouter = Router();

walletRouter.get('/type', WalletTypeController.getWalletTypes)
walletRouter.post('/type',  WalletTypeController.createWalletType)

export default walletRouter