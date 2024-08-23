/* eslint-disable no-useless-catch */
import { PrismaClient, UserInfo } from "@prisma/client";

const prisma = new PrismaClient();

class ProfileService {

    // add user profile using userId and return a promise
    async addProfile(userId: string, data: any): Promise<UserInfo | null> {
        try {
            const user = await prisma.userInfo.create({ data: { userId, ...data } });
            return user;
        } catch (error) {
            throw error;
        }
    }

    // get user profile using userId and return a promise
    async getProfile(userId: string): Promise<UserInfo | null> {
        try {
            const user = await prisma.userInfo.findUnique({ where: { userId: userId } });
            return user;
        } catch (error) {
            throw error;
        }
    }

    // update user profile using userId and return a promise
    async updateProfile(userId: string, data: any): Promise<UserInfo | null> {
        try {
            const user = await prisma.userInfo.update({ where: { userId: userId }, data: data });
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default new ProfileService()