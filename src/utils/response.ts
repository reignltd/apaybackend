import { Response } from "express";


interface ApiResponse {
    message: string;
    data?: unknown;
    error?: unknown;
    success: boolean;
    code: number;
}

// Send Response
export const sendResponse = (res: Response, payload: ApiResponse, statusCode: number) => {
    const {message, success, data, error, code} = payload

    res.status(statusCode).json({message, success, data, error, code})
}

// Send Error
export const sendError = (res: Response, message: string, statusCode: number) => {
    sendResponse(res, { success: true, message, code: 400}, statusCode)
}