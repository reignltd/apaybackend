/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendResponse, sendError } from "../utils/response";
import logger from "../logger";
import BeneficiaryService from "../services/BeneficiaryService";

class BeneficiaryController {

    // Create beneficiary
    async createBeneficiary(req: any, res: any) {
        try {
            const userId = req.decoded.userId
            const { name, accountNumber, bank, bankCode } = req.body

            if (!userId || !name || !accountNumber || !bank || !bankCode) {
                return sendError(res, 'Bad request', 400);
            }

            const payload = {
                name: name,
                accountNumber: accountNumber,
                bank: bank,
                bankCode: bankCode,
                userId: userId
            }

            const beneficiary = await BeneficiaryService.createBeneficiary(payload);

            if (!beneficiary) {
                return sendError(res, 'Unable to create beneficiary', 400);
            }

            sendResponse(res, { success: true, message: 'Create beneficiary successfully', data: beneficiary, code: 200 }, 200);
            logger.info('Create beneficiary successfully');
            return

        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Create beneficiary failed: `);
            return
        }
    }

    // Get beneficiary by user id
    async getBeneficiaryByUserId(req: any, res: any) {
        try {
            const userId = req.decoded.userId
            const beneficiary = await BeneficiaryService.getBeneficiaryByUserId(userId);
            
            sendResponse(res, { success: true, message: 'Get beneficiary successfully', data: beneficiary, code: 200 }, 200);
            logger.info('Get beneficiary successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get beneficiary failed: `);
            return
        }
    }

    // Delete beneficiary by user id and beneficiary id
    async deleteBeneficiary(req: any, res: any) {
        try {
            const userId = req.decoded.userId
            const beneficiaryId = req.params.beneficiaryId
            const beneficiary = await BeneficiaryService.deleteBeneficiary(beneficiaryId, userId);

            if (!beneficiary) {
                return sendError(res, 'Unable to delete beneficiary', 400);
            }

            sendResponse(res, { success: true, message: 'Delete beneficiary successfully', data: beneficiary, code: 200 }, 200);
            logger.info('Delete beneficiary successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Delete beneficiary failed: `);
            return
        }
    }
}

export default new BeneficiaryController()