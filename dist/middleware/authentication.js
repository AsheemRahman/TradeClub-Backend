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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const statusCode_1 = require("../constants/statusCode");
const errorMessage_1 = require("../constants/errorMessage");
const authenticationMiddleware = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const JWT_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
            const accessToken = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken);
            if (!accessToken) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.TOKEN_NOT_FOUND });
                return;
            }
            jsonwebtoken_1.default.verify(accessToken, JWT_KEY, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
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
            }));
        }
        catch (error) {
            console.error("Middleware error:", error);
            res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    });
};
exports.default = authenticationMiddleware;
