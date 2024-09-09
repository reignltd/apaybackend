/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendResponse, sendError } from "../utils/response";
import logger from "../logger";
import FlutterwaveService from "../services/FlutterwaveService";

class BillsController {

    // Get bills categories
    async getBillsCategories(req: any, res: any) {
        try {
            const billsCategories = await FlutterwaveService.getBillsCategories();
            sendResponse(res, { success: true, message: 'Get bills categories successfully', data: billsCategories, code: 200 }, 200);
            logger.info('Get bills categories successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get bills categories failed: `);
            return
        }
    }

    // Get bill's items
    async getBillItems(req: any, res: any) {
        try {
            const { category } = req.query
            const billItems = await FlutterwaveService.getBillItems(category);
            sendResponse(res, { success: true, message: 'Get bill items successfully', data: billItems, code: 200 }, 200);
            logger.info('Get bill items successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get bill items failed: `);
            return
        }
    }

    // Get biller's information
    async getBillInformation(req: any, res: any) {
        try {
            const { billerCode } = req.query
            const billerInformation = await FlutterwaveService.getBillInformation(billerCode);
            sendResponse(res, { success: true, message: 'Get biller information successfully', data: billerInformation, code: 200 }, 200);
            logger.info('Get biller information successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get biller information failed: `);
            return
        }
    }

    // Get Bill Validation
    async validateBill(req: any, res: any) {
        try {
            const { billerCode, customer, itemCode } = req.query
            const billValidation = await FlutterwaveService.validateBill(billerCode, customer, itemCode);
            sendResponse(res, { success: true, message: 'Get bill validation successfully', data: billValidation, code: 200 }, 200);
            logger.info('Get bill validation successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get bill validation failed: `);
            return
        }
    }
}

export default new BillsController()