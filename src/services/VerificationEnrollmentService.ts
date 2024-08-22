import { PrismaClient } from "@prisma/client";
import logger from "../logger";

const prisma = new PrismaClient()

class VerificationEnrollmentService {

    // Generalized method to check if verification data exists
    async isVerification(userId: string, verificationBankId: string) {
        const check = await prisma.verificationEnrollment.findFirst({
            where: {
                userId,
                verificationBankId,
            },
        });

        return check || null;
    }

    // check for bvn
    async isBVN(userId: string, verificationBankId: string) {
        return this.isVerification(userId, verificationBankId);
    }

    // check for nin
    async isNIN(userId: string, verificationBankId: string) {
        return this.isVerification(userId, verificationBankId);
    }

    // check for phone number
    async isPhoneNumber(userId: string, verificationBankId: string) {
        return this.isVerification(userId, verificationBankId);
    }

    // Generalized method to add verification data
    async addVerification(userId: string, verificationBankId: string, data: object): Promise<boolean> {
        try {
            await prisma.verificationEnrollment.create({
                data: {
                    userId,
                    verificationBankId,
                    data,
                },
            });

            return true;
        } catch (e) {
            if (e.code === 'P2002') {
                logger.warn(`${verificationBankId} already exists`);
                return false;
            }
            throw e;
        }
    }

    // Add bvn
    async addBVN(userId: string, verificationBankId: string, data: object): Promise<boolean> {
        return this.addVerification(userId, verificationBankId, data);
    }

    // Add nin
    async addNIN(userId: string, verificationBankId: string, data: object): Promise<boolean> {
        return this.addVerification(userId, verificationBankId, data);
    }

    // Add phone number
    async addPhoneNumber(userId: string, verificationBankId: string, data: object): Promise<boolean> {
        return this.addVerification(userId, verificationBankId, data);
    }


}

export default new VerificationEnrollmentService()