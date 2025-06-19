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
            let Token: string | undefined;
            if (req.headers.authorization?.startsWith("Bearer ")) {
                Token = req.headers.authorization.split(" ")[1];
                // console.log("Token in others",Token)
            } else if (req.cookies?.["admin-accessToken"]) {
                Token = req.cookies["admin-accessToken"];
                console.log("Token in admin",Token)
            }
            if (!Token) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Access token not found, please log in" });
                return;
            }
            jwt.verify(Token, JWT_KEY, async (err: unknown, data: any) => {
                if (err) {
                    return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Invalid or expired token, please log in again." });
                }
                if (!data) {
                    return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Invalid token structure." });
                }
                const userId = data.userId;
                const role = data.role;
                // Check role
                if (requiredRole && role !== requiredRole) {
                    return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Access denied: Insufficient permissions." });
                }
                req.userId = userId;
                req.role = role;
                next();
            });
        } catch (error) {
            res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            return;
        }
    };
};