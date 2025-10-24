import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { STATUS_CODES } from "../constants/statusCode";
import { ERROR_MESSAGES } from '../constants/errorMessage';


const authenticationMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const JWT_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
            const accessToken = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

            if (!accessToken) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: ERROR_MESSAGES.TOKEN_NOT_FOUND });
                return;
            }

            jwt.verify(accessToken, JWT_KEY, async (err: unknown, data: JwtPayload | string | undefined) => {
                if (err) {
                    console.error("Token error:", accessToken, err);
                    return res.status(STATUS_CODES.FORBIDDEN).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
                }

                if (!data) {
                    return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Invalid token structure." });
                }

                const { role, userId } = data as { role: string, userId: string }

                // Optional logging (still keeping role if needed elsewhere)
                console.error("Token validated. User ID:", userId, "Role:", role);

                req.userId = userId;
                req.role = role;
                next();
            });

        } catch (error) {
            console.error("Middleware error:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    };
};

export default authenticationMiddleware