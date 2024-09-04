import { Request, Response } from 'express';
import { sendResponse, sendError } from '../utils/response';
import AuthService from '../services/AuthService';
import logger from '../logger';
import VerificationEnrollmentService from '../services/VerificationEnrollmentService';
import { VerificationType } from '@prisma/client';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

class AuthController {
    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               role:
     *                 type: string
     *     responses:
     *       '201':
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *       '400':
     *         description: Failed to register user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     */
    async register(req: Request, res: Response) {
        const { email, password, role } = req.body;

        try {
            // check if email and password is empty
            if (!email || !password) {
                sendError(res, 'Email and password are required', 400);
                logger.error('Email and password are required');
                return;
            }
            const user = await AuthService.register({ email, password, role });

            if (user) {
                sendResponse(res, { success: true, message: 'User created successfully', data: {}, code: 200 }, 201);
                logger.info(`User ${email} created successfully`);
                return;
            } else {
                sendError(res, 'Failed to create user', 400);
                logger.error('Failed to create user');
                return
            }
        } catch (error) {
            if (error instanceof Error) {
                sendError(res, error.message, 400);
                logger.error(`Error creating user: ${error.message}`);
                return
            } else {
                sendError(res, 'An unknown error occurred', 400);
                logger.error(`Error Creating user: An unknown error occurred`);
                return
            }
        }
    }

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login a user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       '200':
     *         description: User logged in successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *       '400':
     *         description: Failed to login
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     */
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            // check if email and password is empty
            if (!email || !password) {
                sendError(res, 'Invalid credentials', 400);
                logger.error('Email and password are required');
                return;
            }

            const user = await AuthService.login({ email, password });
            const isBvn = await VerificationEnrollmentService.getVerificationEnrollment(user.id, VerificationType.BVN);
            const isNin = await VerificationEnrollmentService.getVerificationEnrollment(user.id, VerificationType.NIN);
            const isPhone = await VerificationEnrollmentService.getVerificationEnrollment(user.id, VerificationType.PHONENUMBER);

            sendResponse(res, {
                success: true,
                message: 'User logged in successfully',
                data: { ...user, isBvn: isBvn ? true : false, isNin: isNin ? true : false, isPhone: isPhone ? true : false },
                code: 200
            }, 200);

            logger.info(`User ${email} logged in successfully`);
            return;
        } catch (error) {
            if (error instanceof Error) {
                sendError(res, error.message, 400);
                logger.error(`Error logging in user: ${error.message}`);
                return
            } else {
                sendError(res, 'An unknown error occurred', 400);
                logger.error(`Error Logging in user: An unknown error occurred`);
                return
            }
        }
    }

    // Forgot Password
    async forgetPassword(req: Request, res: Response) {
        const { email } = req.body

        try {
            const resetToken = await AuthService.forgetPassword(email);
            sendResponse(res, { success: true, message: 'Password reset token sent to your email', data: resetToken, code: 200 }, 200);
            return
        } catch (error) {
            if (error instanceof Error) {
                sendError(res, error.message, 400);
                logger.error(`Error logging in user: ${error.message}`);
                return
            } else {
                sendError(res, 'An unknown error occurred', 400);
                logger.error(`Error Logging in user: An unknown error occurred`);
                return
            }
        }
    }

    // Reset Password
    async resetPassword(req: Request, res: Response) {
        const { resetToken, password } = req.body;

        try {
            const resetPassword = await AuthService.resetPassword(resetToken, password);
            sendResponse(res, { success: true, message: 'Password reset successfully', data: resetPassword, code: 200 }, 200);
            return
        } catch (error) {
            if (error instanceof Error) {
                sendError(res, error.message, 400);
                logger.error(`Error logging in user: ${error.message}`);
                return
            } else {
                sendError(res, 'An unknown error occurred', 400);
                logger.error(`Error Logging in user: An unknown error occurred`);
                return
            }
        }
    }
}

export default new AuthController();
