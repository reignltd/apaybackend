/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendResponse, sendError } from "../utils/response";
import WalletTypeService from "../services/WalletTypeService";
import logger from "../logger";

class WalletTypeController {

    // Get all wallet types
    async getWalletTypes(req: any, res: any) {
        try {
            const walletTypes = await WalletTypeService.getWalletTypes();
            sendResponse(res, { success: true, message: 'Get wallet types successfully', data: walletTypes, code: 200 }, 200);
            logger.info('Get wallet types successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get wallet types failed: `);
            return
        }
    }
}

export default new WalletTypeController()