"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const statusCode_1 = require("../constants/statusCode");
const errorMessage_1 = require("../constants/errorMessage");
const authenticationMiddleware = () => {
    return async (req, res, next) => {
        try {
            const JWT_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
            const accessToken = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
            if (!accessToken) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.TOKEN_NOT_FOUND });
                return;
            }
            jsonwebtoken_1.default.verify(accessToken, JWT_KEY, async (err, data) => {
                if (err) {
                    console.error("Token error:", accessToken, err);
                    return res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_TOKEN });
                }
                if (!data) {
                    return res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ message: "Invalid token structure." });
                }
                const { role, userId } = data;
                // Optional logging (still keeping role if needed elsewhere)
                console.error("Token validated. User ID:", userId, "Role:", role);
                req.userId = userId;
                req.role = role;
                next();
            });
        }
        catch (error) {
            console.error("Middleware error:", error);
            res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    };
};
exports.default = authenticationMiddleware;
//# sourceMappingURL=authentication.js.map