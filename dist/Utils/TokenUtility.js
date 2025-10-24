"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Token {
    generatingTokens(id, role = 'admin') {
        const accessToken = jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
}
exports.Token = Token;
