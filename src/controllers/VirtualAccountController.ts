/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendError, sendResponse } from '../utils/response';
import VirtualAccountService from '../services/VirtualAccountService';
import ProfileService from '../services/ProfileService';
import VerificationEnrollmentService from '../services/VerificationEnrollmentService';
import logger from '../logger';
import { VerificationType } from '@prisma/client';

type userBvnType = {
    bvn: string,
    nin: string,
    email: string,
    image: string,
    title: string,
    gender: string,
    last_name: string,
    first_name: string,
    middle_name: string,
    nationality: string,
    name_on_card: string,
    watch_listed: string,
    date_of_birth: string,
    lga_of_origin: string,
    phone_number1: string,
    phone_number2: string,
    marital_status: string,
    enrollment_bank: string,
    state_of_origin: string,
    level_of_account: string,
    lga_of_residence: string,
    enrollment_branch: string,
    registration_date: string,
    state_of_residence: string,
    residential_address: string
}

class VirtualAccountController {
    async createVirtualAccount(req: any, res: any) {
        const userId = req.decoded.userId
        const email = req.decoded.email

        // check if the user has a virtual account before
        const check = await VirtualAccountService.isVirtualAccount(userId)

        if (check) {
            sendResponse(res, { success: true, message: 'You already have a virtual account', data: check, code: 400 }, 200);
            return
        }

        // get user information
        const userProfile = await ProfileService.getProfile(userId)

        // get user BVN
        const userBvn = await VerificationEnrollmentService.getVerificationEnrollment(userId, VerificationType.BVN)

        if (userBvn) {
            
            const newUserBvn: userBvnType | null = userBvn?.data as userBvnType | null

            const data = {
                userId,
                email,
                firstname: userProfile?.firstName as string,
                lastname: userProfile?.lastName as string,
                phonenumber: userProfile?.phoneNumber as string,
                bvn: newUserBvn?.bvn as string
            }

            const newVirtualAccount = await VirtualAccountService.createVirtualAccount(data)

            if (newVirtualAccount) {
                sendResponse(res, { success: true, message: 'Virtual account created successfully', data: newVirtualAccount, code: 200 }, 200);
                logger.info('Virtual account created successfully');
                return
            } else {
                sendError(res, 'Unable to generate virtual account for you now', 400);
                logger.error(`Create virtual account failed: `);
                return
            }
        }
    }

    // get virtual account based on userId
    async getVirtualAccount(req: any, res: any) {
        const userId = req.decoded.userId
        const virtualAccount = await VirtualAccountService.getVirtualAccount(userId)

        if (virtualAccount) {
            sendResponse(res, { success: true, message: 'Virtual account retrieved successfully', data: virtualAccount, code: 200 }, 200);
            logger.info('Virtual account retrieved successfully');
            return
        } else {
            sendError(res, 'Unable to retrieve virtual account', 400);
            logger.error(`Get virtual account failed: `);
            return
        }
    }
}

export default new VirtualAccountController()