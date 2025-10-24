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
const dotenv_1 = __importDefault(require("dotenv"));
const TokenUtility_1 = require("../../../Utils/TokenUtility");
const message_1 = require("../../../Constants/message");
const statusCode_1 = require("../../../Constants/statusCode");
// import IAdminService from "../../../service/admin/IAdminService"
dotenv_1.default.config();
class AdminController {
    // private _adminService: IAdminService;
    // constructor(adminService: IAdminService) {
    //     this._adminService = adminService;
    // }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: message_1.ERROR_MESSAGES.BAD_REQUEST, data: null });
                }
                const isAdmin = process.env.ADMIN_USERNAME === email && process.env.ADMIN_PASSWORD === password;
                if (isAdmin) {
                    const tokenInstance = new TokenUtility_1.Token();
                    const { accessToken, refreshToken } = tokenInstance.generatingTokens(email);
                    if (accessToken && refreshToken) {
                        res.cookie("admin-refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 2 * 24 * 60 * 60 * 1000, });
                        res.cookie("admin-accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: 15 * 60 * 1000, });
                        res.status(statusCode_1.STATUS_CODES.OK).json({ successs: true, message: "Sign-in successful", data: { accessToken, user: { id: email, role: "admin" } } });
                        return;
                    }
                }
                else {
                    res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ success: false, message: message_1.ERROR_MESSAGES.UNAUTHORIZED, data: null });
                }
            }
            catch (error) {
                console.error("Error during signup:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: message_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies['admin-refreshToken'];
                if (!refreshToken) {
                    res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ success: false, message: 'Refresh token missing' });
                    return;
                }
                // **Verify the refresh token**
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: 'Invalid refresh token' });
                    }
                    // Generate a new access token
                    const tokenInstance = new TokenUtility_1.Token();
                    const newAccessToken = tokenInstance.generatingTokens(decoded.id, decoded.role).accessToken;
                    console.log("new access token", newAccessToken);
                    res.cookie("admin-accessToken", newAccessToken, {
                        httpOnly: false,
                        secure: true,
                        sameSite: "none",
                        maxAge: 15 * 60 * 1000,
                    });
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, accessToken: newAccessToken });
                });
            }
            catch (error) {
                console.error('Error refreshing token:', error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    ;
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("admin-accessToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.clearCookie("admin-refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Logout successful", });
                return;
            }
            catch (error) {
                console.error("Logout error:", error);
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ error: "logout failed" });
                return;
            }
        });
    }
}
exports.default = AdminController;
