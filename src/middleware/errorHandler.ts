import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/statusCode";
import { ERROR_MESSAGES } from "../constants/message";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error middleware caught:", err);

    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
        status: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
