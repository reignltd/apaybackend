import { Request, Response } from 'express';
import { sendResponse, sendError } from '../utils/response';
import VerificationService from '../services/VerificationService';
import logger from '../logger';

class VerificationController {

    // Get Screening Response
    async getScreeningResponse(req: Request, res: Response) {
        try {
            const response = await VerificationService.getScreeningInfoResponse();
            sendResponse(res, { success: true, message: 'Get screening response successfully', data: response, code: 200 }, 200);
            logger.info('Get screening response successfully');
            return
        } catch (e) {
            sendError(res, 'Error', 400);
            logger.error(`Get screening response failed: `);
            return
        }
    }

    // Get BVN Advance
    async getBVNAdvanceResponse(req: Request, res: Response) {
        try {
            const { bvn } = req.body;
            const response = await VerificationService.getBVNAdvanceResponse(Number(bvn));
            sendResponse(res, { success: true, message: 'Get bvn advance response successfully', data: response, code: 200 }, 200);
            logger.info('Get bvn advance response successfully');
            return
        } catch (e) {
            sendError(res,'Unable to retrieve BVN data', 400);
            logger.error(`Get bvn advance response failed: `);
            return
        }
    }

    // Get NIN Advance
    async getNINAdvanceResponse(req: Request, res: Response) {
        try {
            const { nin } = req.body;
            const response = await VerificationService.getNINAdvanceResponse(Number(nin));
            sendResponse(res, { success: true, message: 'Get nin advance response successfully', data: response, code: 200 }, 200);
            logger.info('Get nin advance response successfully');
            return
        } catch (e) {
            sendError(res,'Unable to retrieve NIN data', 400);
            logger.error(`Get nin advance response failed: `);
            return
        }
    }

    // Get Phone Number
    async getPhoneNumberAdvanceResponse(req: Request, res: Response) {
        try {
            const { phoneNumber } = req.body;
            const response = await VerificationService.getPhoneNumberAdvanceResponse(Number(phoneNumber));
            sendResponse(res, { success: true, message: 'Get phone number advance response successfully', data: response, code: 200 }, 200);
            logger.info('Get phone number advance response successfully');
            return
        } catch (e) {
            sendError(res,'Unable to retrieve phone number data', 400);
            logger.error(`Get phone number advance response failed: `);
            return
        }
    }
}

export default new VerificationController()