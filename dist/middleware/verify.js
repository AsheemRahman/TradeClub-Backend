"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const statusCode_1 = require("../constants/statusCode");
const errorMessage_1 = require("../constants/errorMessage");
const JwtUtility_1 = __importDefault(require("../utils/JwtUtility"));
const userSchema_1 = require("../model/user/userSchema");
const expertSchema_1 = require("../model/expert/expertSchema");
dotenv_1.default.config();
const validate = (requiredRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            let token;
            // Extract token
            if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (!token) {
                token = ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b["accessToken"]) || ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c["admin-accessToken"]);
            }
            if (!token) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.TOKEN_NOT_FOUND });
                return;
            }
            // Verify token synchronously
            const data = JwtUtility_1.default.verifyToken(token, false);
            if (!data || !data.userId) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ message: "Invalid token structure." });
                return;
            }
            // Role check
            if (requiredRole && data.role !== requiredRole) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ message: "Access denied: Insufficient permissions." });
                return;
            }
            const { role, userId } = data;
            let account = null;
            // Fetch from DB only for user/expert
            if (role === "user") {
                account = yield userSchema_1.User.findById(userId);
            }
            else if (role === "expert") {
                account = yield expertSchema_1.Expert.findById(userId);
            }
            else if (role === "admin") {
                req.role = "admin";
                req.userId = "admin";
                return next();
            }
            else {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ message: "Invalid role in token." });
                return;
            }
            if (!account) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: "Account not found." });
                return;
            }
            if (account.isActive === false) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ message: "Your account is blocked or inactive. Please contact support.", });
                return;
            }
            req.userId = userId;
            req.role = role;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({
                    message: "Access token expired, please refresh or log in again."
                });
            }
            else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({
                    message: errorMessage_1.ERROR_MESSAGES.INVALID_TOKEN
                });
            }
            else {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    message: "Something went wrong."
                });
            }
        }
    });
};
exports.validate = validate;
