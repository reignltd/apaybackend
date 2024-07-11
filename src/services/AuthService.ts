import { PrismaClient, Role } from "@prisma/client";
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
    async isEmailTaken (email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        return !!user
    }
}

export default new AuthService()