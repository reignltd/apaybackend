/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendResponse, sendError } from "../utils/response";
import ProfileService from "../services/ProfileService";
import logger from "../logger";

class ProfileController {

    // add user profile using userId and return a promise
    async addProfile(req: any, res: any) {
        try {
            const userId = req.decoded.userId;
            const data = req.body;
            const user = await ProfileService.addProfile(userId, data);

            if (user) {
                sendResponse(res, { success: true, message: 'Add user profile successfully', data: user, code: 200 }, 200);
                logger.info('Add user profile successfully');
                return
            } else {
                sendError(res, 'Error', 400);
                logger.error(`Add user profile failed: `);
                return
            }

        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Add user profile failed: `);
            return
        }
    }

    // get user profile using userId and return a promise
    async getProfile(req: any, res: any) {
        try {
            const userId = req.decoded.userId;
            const user = await ProfileService.getProfile(userId);
            sendResponse(res, { success: true, message: 'Get user profile successfully', data: user, code: 200 }, 200);
            logger.info('Get user profile successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get user profile failed: `);
            return
        }
    }
}

export default new ProfileController()