import { PrismaClient } from "@prisma/client";
import { VerificationType, VerificationBank } from "@prisma/client";
import logger from "../logger";

const prisma = new PrismaClient()

class AuthorizationService {

    // Generalized method to check if verification data exists
    async isVerification(type: VerificationType, number: string): Promise<VerificationBank | null> {
        try {
            const check = await prisma.verificationBank.findFirst({
                where: {
                    number,
                    type,
                },
            });

            return check ?? null;
        } catch (error) {
            logger.error(`Error fetching verification data for ${type}: ${error}`);
            throw error;
        }
    }

    async isBVN(bvn: string): Promise<VerificationBank | null> {
        return this.isVerification(VerificationType.BVN, bvn);
    }

    async isNIN(nin: string): Promise<VerificationBank | null> {
        return this.isVerification(VerificationType.NIN, nin);
    }

    async isPhoneNumber(phoneNumber: string): Promise<VerificationBank | null> {
        return this.isVerification(VerificationType.PHONENUMBER, phoneNumber);
    }

    // Generalized method to add verification data
    async addVerification(type: VerificationType, number: string, data: Record<string, any>): Promise<VerificationBank | null> {
        try {
            const addVerification = await prisma.verificationBank.create({
                data: {
                    number,
                    type,
                    data,
                },
            });

            return addVerification;
        } catch (e: any) {
            if (e.code === 'P2002') {
                logger.warn(`${type} already exists in the database.`);
                return null;
            }
            logger.error(`Error adding verification data for ${type}: ${e}`);
            throw e;
        }
    }

    async addBVN(bvn: string, data: Record<string, any>): Promise<VerificationBank | null> {
        return this.addVerification(VerificationType.BVN, bvn, data);
    }

    async addNIN(nin: string, data: Record<string, any>): Promise<VerificationBank | null> {
        return this.addVerification(VerificationType.NIN, nin, data);
    }

    async addPhoneNumber(phoneNumber: string, data: Record<string, any>): Promise<VerificationBank | null> {
        return this.addVerification(VerificationType.PHONENUMBER, phoneNumber, data);
    }
}

export default new AuthorizationService();
