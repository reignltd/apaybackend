import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BeneficiaryParams {
    name: string;
    accountNumber: string;
    bank: string;
    bankCode: string;
    userId: string;
}

class Beneficiary {

    // Create beneficiary
    async createBeneficiary(payload: BeneficiaryParams) {
        const beneficiary = await prisma.beneficiary.create({
            data : {
                userId: payload.userId,
                name: payload.name,
                account: payload.accountNumber,
                bank: payload.bank,
                bankCode: payload.bankCode
            }
        });
        
        if (!beneficiary) {
            return false
        }
        return true;
    }

    // Get beneficiary
    async getBeneficiary(userId: string) {
        const beneficiary = await prisma.beneficiary.findMany({
            where: {
                userId
            }
        });
        return beneficiary;
    }

    // Get beneficiary by user id
    async getBeneficiaryByUserId(userId: string) {
        const beneficiary = await prisma.beneficiary.findMany({
            where: {
                userId
            }
        });
        return beneficiary;
    }

    // Delete beneficiary by user id and beneficiary id
    async deleteBeneficiary(beneficiaryId: string, userId: string) {
        const beneficiary = await prisma.beneficiary.delete({
            where: { id : beneficiaryId, userId },
        });
        if (!beneficiary) {
            return false
        }
        return true;
    }
}

export default new Beneficiary()