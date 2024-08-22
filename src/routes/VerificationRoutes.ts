import { Router } from "express";
import VerificationController from "../controllers/VerificationController";

const router = Router();

// router.get('/', VerificationController.getScreeningResponse)
router.post('/advancebvn', VerificationController.getBVNAdvanceResponse)
router.post('/advancenin', VerificationController.getNINAdvanceResponse)
router.post('/phonenumber', VerificationController.getPhoneNumberAdvanceResponse)

export default router