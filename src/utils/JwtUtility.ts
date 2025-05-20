import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string;


export interface TokenPayload {
    userId: string;
    role: string;
}


class JwtUtility {
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, accessSecret, { expiresIn: '15m' });
    }

    static generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
    }

    static verifyToken(token: string, isRefresh = false): string | JwtPayload {
        const secret = isRefresh ? refreshSecret : accessSecret;
        return jwt.verify(token, secret);
    }
}


export default JwtUtility;