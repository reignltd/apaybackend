/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendResponse, sendError } from "../utils/response";
import logger from "../logger";
import WalletService from "../services/WalletService";
import WalletTypeService from "../services/WalletTypeService";

class WalletController {

    // Create Wallet
    async createWallet(req: any, res: any) {
        try {
            const userId = req.decoded.userId
            const { walletTypeId, name, percentageCut, targetAmount } = req.body;

            if (!name || !percentageCut || !targetAmount || !walletTypeId) {
                return sendError(res, 'Bad Request', 400)
            }

            // get wallet type
            const walleType = await WalletTypeService.getWalletTypeById(walletTypeId);

            if (!walleType) {
                return sendError(res, 'Wallet type not found', 400);
            }
            
            let expirationDate = new Date();

            const walletTypeDuration = walleType.duration;

            if (walletTypeDuration > 0) {
                expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + walletTypeDuration);
            }

            const payload = {
                name: name,
                userId: userId,
                expiryDate: expirationDate,
                walletTypeId: walletTypeId,
                percentageCut: percentageCut,
                targetAmount: targetAmount
            }

            const wallet = await WalletService.createWallet(payload);
            sendResponse(res, { success: true, message: 'Wallet created successfully', data: wallet, code: 200 }, 200);
            logger.info('Wallet created successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            console.log('Wallet Creation Error: ', e)
            logger.error(`Wallet creation failed: `);
            return
        }
    }

    // Get user wallet by user id
    async getWalletByUserId(req: any, res: any) {
        try {
            const userId = req.decoded.userId
            const wallet = await WalletService.getWalletByUserId(userId);
            sendResponse(res, { success: true, message: 'Get user wallet successfully', data: wallet, code: 200 }, 200);
            logger.info('Get user wallet successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get user wallet failed: `);
            return
        }
    }
}

export default new WalletController()