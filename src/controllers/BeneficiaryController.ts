/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendResponse, sendError } from "../utils/response";
import logger from "../logger";
import BeneficiaryService from "../services/BeneficiaryService";
import FlutterwaveService from "../services/FlutterwaveService";

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

    // Get banks in Nigeria
    async getBanks(req: any, res: any) {
        try {
            const banks = await FlutterwaveService.getBanks();
            sendResponse(res, { success: true, message: 'Get banks successfully', data: banks, code: 200 }, 200);
            logger.info('Get banks successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get banks failed: `);
            return
        }
    }

    // Post account resolve
    async accountResolve(req: any, res: any) {
        try {
            const { account_number, bank_code } = req.body
            const account = await FlutterwaveService.accountResolve({ account_number, bank_code });
            sendResponse(res, { success: true, message: 'Get account successfully', data: account, code: 200 }, 200);
            logger.info('Get account successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get account failed: `);
            return
        }
    }
}

export default new BeneficiaryController()