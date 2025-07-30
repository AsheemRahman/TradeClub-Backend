import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { ERROR_MESSAGES } from "../constants/message";
import { STATUS_CODES } from "../constants/statusCode";


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
            const JWT_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
            let token: string | undefined;
            // Extract token
            if (req.headers.authorization?.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else if (req.cookies?.["admin-accessToken"]) {
                token = req.cookies["admin-accessToken"];
            }

            if (!token) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Access token not found, please log in" });
                return;
            }

            // Verify token synchronously
            const data = jwt.verify(token, JWT_KEY) as { userId: string; role: string };

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
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                res.status(STATUS_CODES.FORBIDDEN).json({ message: "Access token expired, please refresh or log in again." });
            } else {
                res.status(STATUS_CODES.FORBIDDEN).json({ message: "Invalid or expired token, please log in again." });
            }
        }
    };
};
