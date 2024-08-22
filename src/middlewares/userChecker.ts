import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../utils/response';
import jwt from 'jsonwebtoken';

// Define your secret key for JWT
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secretkey';

// Middleware to check if the user is authenticated and has the necessary role
export function checkRole(role: string) {
    return function(req: any, res: Response, next: NextFunction) {
        // Get the JWT token from the request headers
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if (!token) {
            sendError(res, 'Authentication failed', 400);
            return
        }

        try {
            // Verify the token
            const decoded: any = jwt.verify(token, JWT_SECRET);

            console.log('Decoded User: ', decoded)

            // Check if the decoded token has the necessary role
            if (decoded.role !== role) {
                sendError(res, 'Unauthorized', 401);
                return
            }

            // If the user has the necessary role, proceed to the next middleware
            // Attach the decoded object to the request object
            (req as any).decoded = decoded;
            next();
        } catch (error) {
            console.error('Error verifying JWT:', error);
            sendError(res, 'Authentication failed', 400);
            return
        }
    };
}
