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

    // Post wallet type
    async createWalletType(req: any, res: any) {
        try {
            const {walletName, walletPercentage, walletDuration} = req.body

            if (!walletName ) {
                return sendError(res, 'Bad request', 400);
            }

            const payload = {
                name: walletName,
                percentage : walletPercentage,
                duration : walletDuration
            }
            
            const walletType = await WalletTypeService.createWalletType(payload);

            if (!walletType) {
                return sendError(res, 'Unable to create wallet type', 400);
            }

            sendResponse(res, { success: true, message: 'Create wallet type successfully', data: walletType, code: 200 }, 200);
            logger.info('Create wallet type successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Create wallet type failed: `);
            return
        }
    }
}

export default new WalletTypeController()