/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendResponse, sendError } from "../utils/response";
import FlutterwaveService from "../services/FlutterwaveService";
import logger from "../logger";

class TransferController {

    // Get a transfer fee
    async checkTransferFee(req: any, res: any) {
        try {
            const { amount } = req.body
            const transferFee = await FlutterwaveService.transferFee(amount);
            sendResponse(res, { success: true, message: 'Get transfer fee successfully', data: transferFee, code: 200 }, 200);
            logger.info('Get transfer fee successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get transfer fee failed: `);
            return
        }
    }

    // Make transfer
    async makeTransfer(req: any, res: any) {
        try {
            const { bank_code, account_number, amount, narration } = req.body
            const payload = {
                bank_code: bank_code,
                account_number: Number(account_number),
                amount: Number(amount),
                narration: narration,
            }

            const transfer = await FlutterwaveService.transferMoney(payload);
            sendResponse(res, { success: true, message: 'Make transfer successfully', data: transfer, code: 200 }, 200);
            logger.info('Make transfer successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Make transfer failed: `);
            return
        }
    }
}

export default new TransferController()