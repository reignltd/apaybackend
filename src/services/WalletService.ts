import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface WalletParams {
    userId: string;
    walletTypeId: string;
    name: string;
    expiryDate?: Date;
    targetAmount: number;
    percentageCut: number
}

class WalletService {

    // Create Wallet
    async createWallet(payload: WalletParams) {
        const wallet = await prisma.wallet.create({
            data: {
                userId: payload.userId,
                walletTypeId: payload.walletTypeId,
                name: payload.name,
                expiryDate: payload.expiryDate,
                targetAmount: payload.targetAmount,
                percentageCut: payload.percentageCut
            }
        });
        
        if (!wallet) {
            return false
        }
        return true;
    }

    // Get wallet by user id
    async getWalletByUserId(userId: string) {
        const wallet = await prisma.wallet.findMany({
            where: {
                userId
            }
        });
        return wallet;
    }

    // Delete cascade wallet by user id and wallet id
    async deleteCascadeWallet(walletId: string, userId: string) {
        const wallet = await prisma.wallet.delete({
            where: { id : walletId, userId },
        });
        if (!wallet) {
            return false
        }
        return true;
    }
}

export default new WalletService()