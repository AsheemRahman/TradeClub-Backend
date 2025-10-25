import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";

import { STATUS_CODES } from "../constants/statusCode";
import { ERROR_MESSAGES } from "../constants/errorMessage";
import JwtUtility from "../utils/JwtUtility";


dotenv.config();


declare module "express-serve-static-core" {
    interface Request {
        userId?: string;
        role?: string;
        email?: string;
    }
}


export const validate = (requiredRole?: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let token: string | undefined;
            // Extract token
            if (req.headers.authorization?.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            }

            if (!token) {
                if (req.cookies?.["accessToken"]) {
                    token = req.cookies["accessToken"];
                } else if (req.cookies?.["admin-accessToken"]) {
                    token = req.cookies["admin-accessToken"];
                }
            }

            if (!token) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: ERROR_MESSAGES.TOKEN_NOT_FOUND });
                return;
            }

            // Verify token synchronously
            const data = JwtUtility.verifyToken(token, false) as { userId: string; role: string };

            if (!data || !data.userId) {
                res.status(STATUS_CODES.FORBIDDEN).json({ message: "Invalid token structure." });
                return;
            }

            // Role check
            if (requiredRole && data.role !== requiredRole) {
                res.status(STATUS_CODES.FORBIDDEN).json({ message: "Access denied: Insufficient permissions." });
                return;
            }

            req.userId = data.userId;
            req.role = data.role;

            next();
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({
                    message: "Access token expired, please refresh or log in again."
                });
            } else if (error instanceof JsonWebTokenError) {
                res.status(STATUS_CODES.FORBIDDEN).json({
                    message: ERROR_MESSAGES.INVALID_TOKEN
                });
            } else {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    message: "Something went wrong."
                });
            }
        }
    };
};
