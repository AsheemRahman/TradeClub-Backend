"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const statusCode_1 = require("../constants/statusCode");
const errorMessage_1 = require("../constants/errorMessage");
const errorHandler = (err, req, res, next) => {
    console.error("Error middleware caught:", err);
    const statusCode = err.statusCode || statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        status: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
