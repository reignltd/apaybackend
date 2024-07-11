import { PrismaClient, Role } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/authhasing";

const prisma = new PrismaClient();

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
        
        return user;
    }

    // Check if the email is taken
    async isEmailTaken (email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        return !!user
    }
}

export default new AuthService()