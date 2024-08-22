import { UserStatus } from "@prisma/client";
import { sendResponse, sendError } from "../utils/response";
import logger from "../logger";
import AuthorizationService from "../services/AuthorizationService";
import VerificationService from "../services/VerificationService";
import VerificationEnrollmentService from "../services/VerificationEnrollmentService";
import AuthService from "../services/AuthService";

class AuthorizationController {

    // Helper function to check if user details match with BVN data
    private async verifyBVNData(theUser: any, bvnData: any): Promise<boolean> {
        // Check if user details match with BVN data
        const isFirstname = theUser?.firstName.toLocaleLowerCase() === bvnData?.first_name?.toLocaleLowerCase();
        const isLastname = theUser?.lastName.toLocaleLowerCase() === bvnData?.last_name?.toLocaleLowerCase();
        const isGender = theUser?.gender?.toLocaleLowerCase() === bvnData?.gender?.toLocaleLowerCase();

        const checker = isFirstname && isLastname && isGender;

        console.log('NAME CHECKER : ', checker, isFirstname, isLastname, isGender)

        return checker;
    }

    // BVN Verification
    async checkBVN(req: any, res: any) {
        const { bvn } = req.body;
        const userId = req.decoded.userId;

        try {
            // Check if BVN exists in the database
            const isBVN = await AuthorizationService.isBVN(String(bvn));
            const theUser = await AuthService.findUserInfoByUserId(userId);

            // If BVN is found in the database
            if (isBVN) {
                const isVerified = await this.verifyBVNData(theUser, isBVN.data);

                if (isVerified) {
                    // Add to verification enrollment
                    const addBvnEnrollment = await VerificationEnrollmentService.addBVN(userId, isBVN.id, isBVN?.data);

                    if (addBvnEnrollment) {
                        sendResponse(res, { success: true, message: 'BVN Verified', data: null, code: 200 }, 200);
                        logger.info('BVN Verified');
                        return;
                    }
                } else {
                    // Block the account
                    const isBlocked = await AuthService.updateUserStatus(userId, UserStatus.BLOCKED);

                    if (isBlocked) {
                        sendResponse(res, { success: true, message: 'Your Account has been blocked', data: null, code: 200 }, 200);
                        logger.info('Account Blocked');
                        return;
                    }
                }
            } else {
                // Fetch BVN from external service if not found in the database
                const fetchBVN = await VerificationService.getBVNAdvanceResponse(Number(bvn));

                if (fetchBVN) {
                    const bvnData = fetchBVN?.entity;

                    // Insert into verification bank
                    const addBVN = await AuthorizationService.addBVN(String(bvn), bvnData);

                    if (addBVN) {
                        const isVerified = await this.verifyBVNData(theUser, bvnData);

                        if (isVerified) {
                            // Add to verification enrollment
                            const addBvnEnrollment = await VerificationEnrollmentService.addBVN(userId, addBVN.id, bvnData);

                            if (addBvnEnrollment) {
                                sendResponse(res, { success: true, message: 'BVN Verified', data: null, code: 200 }, 200);
                                logger.info('BVN Verified');
                                return;
                            }
                        } else {
                            // Block the account
                            const isBlocked = await AuthService.updateUserStatus(userId, UserStatus.BLOCKED);

                            if (isBlocked) {
                                sendResponse(res, { success: true, message: 'Your Account has been blocked', data: null, code: 200 }, 200);
                                logger.info('Account Blocked');
                                return;
                            }
                        }
                    } else {
                        sendError(res, 'Internal Server Error', 500);
                        logger.error('Error in BVN Verification:', 'Internal Server Error');
                        return;
                    }
                } else {
                    sendResponse(res, { success: true, message: 'BVN Not Found', data: null, code: 200 }, 200);
                    logger.info('BVN Not Found');
                    return;
                }
            }
        } catch (error) {
            console.log('Error in BVN Verification @ last catch:', error);
            logger.error('Error in BVN Verification:', error);
            sendError(res, 'Internal Server Error', 500);
        }
    }
}

export default new AuthorizationController();