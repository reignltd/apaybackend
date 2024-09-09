import { Router } from "express";
import BillsController from "../controllers/BillsController";
import { checkRole } from "../middlewares/userChecker";

const billsRouter = Router();

billsRouter.get('/categories', BillsController.getBillsCategories)
billsRouter.get('/items', BillsController.getBillItems)
billsRouter.get('/information', BillsController.getBillInformation)
billsRouter.get('/validate', BillsController.validateBill)

export default billsRouter