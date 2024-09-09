import { Router } from "express";
import TransferController from "../controllers/TransferController";
import { checkRole } from "../middlewares/userChecker";

const transferRouter = Router();

transferRouter.post('/fee', TransferController.checkTransferFee)

// Make transfer
transferRouter.post('/payment', checkRole('USER'), TransferController.makeTransfer)

export default transferRouter