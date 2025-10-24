"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
class JwtUtility {
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, accessSecret, { expiresIn: '15m' });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, refreshSecret, { expiresIn: '7d' });
    }
    static verifyToken(token, isRefresh = false) {
        const secret = isRefresh ? refreshSecret : accessSecret;
        return jsonwebtoken_1.default.verify(token, secret);
    }
}
exports.default = JwtUtility;
