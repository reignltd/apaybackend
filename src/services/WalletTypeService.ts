import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface WalletTypeParams {
    name: string
    percentage: number
    duration: number
}

class WalletTypeService {

    // Get all wallet types
    async getWalletTypes() {
        const walletTypes = await prisma.walletType.findMany();
        return walletTypes;
    }

    // Get wallet type by id
    async getWalletTypeById(id: string) {
        const walletType = await prisma.walletType.findUnique({ where: { id } });
        return walletType;
    }

    // Create a new wallet type
    async createWalletType(payload: WalletTypeParams) {
        const walletType = await prisma.walletType.create({
            data: {
                name: payload.name,
                percentage: payload.percentage,
                duration: payload.duration
            }
        });
        return walletType;
    }

    // Delete a wallet type
    async deleteWalletType(id: string) {
        const walletType = await prisma.walletType.delete({ where: { id } });
        if (!walletType) {
            return false
        }
        return true;
    }

    // Update a wallet type
    async updateWalletType(id: string, payload: WalletTypeParams) {
        const walletType = await prisma.walletType.update({
            where: { id },
            data: {
                name: payload.name,
                percentage: payload.percentage,
                duration: payload.duration
            }
        });
       
        if (!walletType) {
            return false
        }
        return true;
    }
}

export default new WalletTypeService()