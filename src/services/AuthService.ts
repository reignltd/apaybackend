import { PrismaClient, Role, UserStatus } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/authhasing";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

const secretKey = process.env.SECRET_KEY || 'secret';

interface AddUserParams {
    email: string;
    password: string;
    role: Role;
}

interface LoginParams {
    email: string;
    password: string;
}

class AuthService {

    // Register a user
    async register({ email, password, role }: AddUserParams) {
        if (await this.isEmailTaken(email)) {
            throw new Error('Email already taken');
        }
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role
            }
        });
        return user;
    }

    // Login a user
    async login({ email, password }: LoginParams) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            throw new Error('User not found');
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }

        // Access token
        const accessToken = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

        const loginData = {
            accessToken,
            role: user.role
        }
        return loginData;
    }

    // Check if the email is taken
    async isEmailTaken(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        return !!user
    }

    // Implement forget password
    async forgetPassword(email: string) {
        // check if the email is valid
        const isEmail = await this.isEmailTaken(email);
        if (!isEmail) {
            throw new Error('Email not found');
        }

        // Generate reset token
        const resetToken = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

        await prisma.user.update({
            where: { email },
            data: { resetToken: resetToken, resetTokenExpiry: new Date(Date.now() + 3600000) }
        })

        return resetToken
    }

    // Set new password
    async resetPassword(resetToken: string, password: string) {
        try {
            const decodedToken: any = await jwt.verify(resetToken, secretKey);

            const user = await prisma.user.findUnique({
                where: { email: decodedToken.email },
            });

            if (!user || !user.resetToken || user.resetToken !== resetToken || (user.resetTokenExpiry && user.resetTokenExpiry < new Date())) {
                throw new Error('Invalid or expired reset token');
            }

            // Update password
            const hashedPassword = await hashPassword(password);
            await prisma.user.update({
                where: { email: decodedToken.email },
                data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
            });

            return { message: 'Password updated successfully' };
        } catch (error) {
            throw new Error('Invalid or expired reset token');
        }
    }

    // Find a userinfo by id
    async findUserInfoByUserId(id: string) {
        const user = await prisma.userInfo.findUnique({ where: { userId: id } });
        return user;
    }

    // Update user status
    async updateUserStatus(id: string, status: UserStatus) {
        const user = await prisma.user.update({
            where: { id },
            data: { status },
        });
        
        return user;
    }
}

export default new AuthService()