/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import WalletTypeController from "../controllers/WalletTypeController";
import { checkRole } from "../middlewares/userChecker";

const walletRouter = Router();

walletRouter.get('/type', WalletTypeController.getWalletTypes)

export default walletRouter