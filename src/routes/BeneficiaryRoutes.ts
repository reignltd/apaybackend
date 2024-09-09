import { Router } from "express";
import { checkRole } from "../middlewares/userChecker";
import BeneficiaryController from "../controllers/BeneficiaryController";


const beneficiaryRouter = Router();

beneficiaryRouter.post('/create', checkRole('USER'), BeneficiaryController.createBeneficiary)
beneficiaryRouter.get('/get', checkRole('USER'), BeneficiaryController.getBeneficiaryByUserId)
beneficiaryRouter.delete('/delete/:beneficiaryId', checkRole('USER'), BeneficiaryController.deleteBeneficiary)

// Banks
beneficiaryRouter.get('/banks', BeneficiaryController.getBanks)

// Account resolve
beneficiaryRouter.post('/account-resolve', BeneficiaryController.accountResolve)

export default beneficiaryRouter