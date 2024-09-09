 
import { Router } from "express";
import WalletTypeController from "../controllers/WalletTypeController";
import WalletController from "../controllers/WalletController";
import { checkRole } from "../middlewares/userChecker";

const walletRouter = Router();

walletRouter.get('/type', WalletTypeController.getWalletTypes)
walletRouter.post('/type',  WalletTypeController.createWalletType)

// Create user wallet
walletRouter.post('/create', checkRole('USER'), WalletController.createWallet)

// Get user wallet
walletRouter.get('/get', checkRole('USER'), WalletController.getWalletByUserId)

export default walletRouter