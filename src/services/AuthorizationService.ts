import { PrismaClient, VerificationType } from "@prisma/client";
import logger from "../logger";

const prisma = new PrismaClient();

class AuthorizationService {

    // Generalized method to check if verification data exists
    async isVerification(type: VerificationType, number: string) {
        const check = await prisma.verificationBank.findFirst({
            where: {
                number,
                type,
            },
        });

        return check || null;
    }

    async isBVN(bvn: string) {
        return this.isVerification(VerificationType.BVN, bvn);
    }

    async isNIN(nin: string) {
        return this.isVerification(VerificationType.NIN, nin);
    }

    async isPhoneNumber(phoneNumber: string) {
        return this.isVerification(VerificationType.PHONENUMBER, phoneNumber);
    }

    // Generalized method to add verification data
    async addVerification(type: VerificationType, number: string, data: object): Promise<boolean> {
        try {
            await prisma.verificationBank.create({
                data: {
                    number,
                    type,
                    data,
                },
            });

            return true;
        } catch (e) {
            if (e.code === 'P2002') {
                logger.warn(`${type} already exists`);
                return false;
            }
            throw e;
        }
    }

    async addBVN(bvn: string, data: object): Promise<boolean> {
        return this.addVerification(VerificationType.BVN, bvn, data);
    }

    async addNIN(nin: string, data: object): Promise<boolean> {
        return this.addVerification(VerificationType.NIN, nin, data);
    }

    async addPhoneNumber(phoneNumber: string, data: object): Promise<boolean> {
        return this.addVerification(VerificationType.PHONENUMBER, phoneNumber, data);
    }
}

export default new AuthorizationService();
