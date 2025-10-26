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
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const successMessage_1 = require("../../../constants/successMessage");
const otpUtility_1 = __importDefault(require("../../../utils/otpUtility"));
const mailUtility_1 = __importDefault(require("../../../utils/mailUtility"));
const passwordUtils_1 = __importDefault(require("../../../utils/passwordUtils"));
const JwtUtility_1 = __importDefault(require("../../../utils/JwtUtility"));
const role_1 = require("../../../constants/role");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class ExpertController {
    constructor(expertService) {
        //----------------------------- Expert Register -----------------------------
        this.registerPost = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fullName, phoneNumber, email, password } = req.body;
            if (!fullName || !email || !password) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const isEmailUsed = yield this._expertService.findExpertByEmail(email);
            if (isEmailUsed) {
                res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ message: errorMessage_1.ERROR_MESSAGES.EMAIL_ALREADY_EXIST });
                return;
            }
            yield this._expertService.registerExpert({ fullName, phoneNumber, email, password, });
            const otp = yield otpUtility_1.default.otpGenerator();
            yield mailUtility_1.default.sendMail(email, otp, "Verification OTP");
            yield this._expertService.storeOtp(email, otp);
            res.status(statusCode_1.STATUS_CODES.OK).json({ message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp, });
        }));
        //---------------------------- Expert verify OTP ----------------------------
        this.verifyOtp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = req.body;
            if (!otp || !email) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const response = yield this._expertService.findOtp(email);
            const storedOTP = response === null || response === void 0 ? void 0 : response.otp;
            if (storedOTP !== otp) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Incorrect OTP" });
                return;
            }
            const currentExpert = yield this._expertService.findExpertByEmail(email);
            if (!currentExpert) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EXPERT_NOT_FOUND });
                return;
            }
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_VERIFIED });
        }));
        //---------------------------- Expert Resend OTP ----------------------------
        this.resendOtp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Email is required" });
                return;
            }
            const otp = yield otpUtility_1.default.otpGenerator();
            yield mailUtility_1.default.sendMail(email, otp, "Verification otp");
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp, });
            yield this._expertService.storeResendOtp(email, otp);
        }));
        //------------------------------- Expert Login -------------------------------
        this.loginPost = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const currentExpert = yield this._expertService.findExpertByEmail(email);
            if (!currentExpert) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EMAIL_NOT_FOUND });
                return;
            }
            if (!currentExpert.password) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: "User is login by google" });
                return;
            }
            if (!currentExpert.isActive) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: "Expert is Blocked by Admin." });
                return;
            }
            const isPasswordValid = yield passwordUtils_1.default.comparePassword(password, currentExpert.password);
            if (!isPasswordValid) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_CREDENTIALS, data: null });
                return;
            }
            const payload = {
                userId: currentExpert._id.toString(),
                role: role_1.ROLE.EXPERT
            };
            const accessToken = JwtUtility_1.default.generateAccessToken(payload);
            const refreshToken = JwtUtility_1.default.generateRefreshToken(payload);
            res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "none", maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000") });
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true, message: successMessage_1.SUCCESS_MESSAGES.LOGIN,
                data: {
                    accessToken,
                    expert: {
                        id: currentExpert._id,
                        email: currentExpert.email,
                        name: currentExpert.fullName,
                        isVerified: currentExpert.isVerified,
                        role: role_1.ROLE.EXPERT
                    }
                }
            });
        }));
        this.googleLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fullName, email, profilePicture } = req.body;
            if (!fullName || !email || !profilePicture) {
                console.warn("Missing Google credentials");
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "name, email, and image are required.", });
                return;
            }
            let currentExpert = yield this._expertService.findExpertByEmail(email);
            if (!currentExpert) {
                currentExpert = yield this._expertService.registerExpert({ fullName, email, profilePicture, });
                if (!currentExpert) {
                    res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create user.", });
                    return;
                }
            }
            else if (!(currentExpert === null || currentExpert === void 0 ? void 0 : currentExpert.isActive)) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED, });
                return;
            }
            const payload = { userId: currentExpert._id.toString(), role: role_1.ROLE.EXPERT };
            const accessToken = JwtUtility_1.default.generateAccessToken(payload);
            const refreshToken = JwtUtility_1.default.generateRefreshToken(payload);
            res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "none", maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000") });
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true, message: successMessage_1.SUCCESS_MESSAGES.LOGIN,
                data: {
                    accessToken,
                    expert: {
                        id: currentExpert._id,
                        email: currentExpert.email,
                        name: currentExpert.fullName,
                        role: role_1.ROLE.EXPERT,
                        isVerified: currentExpert.isVerified,
                    }
                }
            });
        }));
        //------------------------- Expert Forgot Password -------------------------
        this.forgotPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const currentExpert = yield this._expertService.findExpertByEmail(email);
            if (!currentExpert) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EMAIL_NOT_FOUND });
                return;
            }
            const response = yield this._expertService.findOtp(email);
            const storedOTP = response === null || response === void 0 ? void 0 : response.otp;
            if (!storedOTP) {
                const otp = yield otpUtility_1.default.otpGenerator();
                yield mailUtility_1.default.sendMail(email, otp, "Verification otp");
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp });
                yield this._expertService.storeOtp(email, otp);
            }
            else {
                yield mailUtility_1.default.sendMail(email, Number(storedOTP), "Verification otp");
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, storedOTP, });
                yield this._expertService.storeResendOtp(email, Number(storedOTP));
            }
        }));
        //--------------------------- Expert reset Password ---------------------------
        this.resetPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const currentUser = yield this._expertService.findExpertByEmail(email);
            if (!currentUser) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EMAIL_NOT_FOUND });
                return;
            }
            const updateExpert = yield this._expertService.resetPassword(email, password);
            if (updateExpert) {
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Password Change successfuly" });
            }
            else {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Password change failed" });
            }
        }));
        //---------------------------- Expert verification ----------------------------
        this.expertVerification = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, phoneNumber, profilePicture, DOB, state, country, experience_level, markets_Traded, trading_style, proof_of_experience, year_of_experience, Introduction_video, Government_Id, selfie_Id } = req.body;
            if (!email || !phoneNumber || !profilePicture || !DOB || !state || !country || !experience_level || !markets_Traded || !trading_style || !proof_of_experience || !year_of_experience || !Introduction_video || !Government_Id || !selfie_Id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const isExpert = yield this._expertService.findExpertByEmail(email);
            if (!isExpert) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EMAIL_NOT_FOUND });
                return;
            }
            yield this._expertService.updateDetails({ email, phoneNumber, profilePicture, DOB, state, country, experience_level, markets_Traded, trading_style, proof_of_experience, year_of_experience, Introduction_video, Government_Id, selfie_Id });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Expert details added successfully", });
        }));
        this.logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.LOGOUT });
            return;
        }));
        this.getExpertData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            const expertDetails = yield this._expertService.getExpertById(id);
            if (!expertDetails) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            if (expertDetails.isActive) {
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.DATA_RETRIEVED, expertDetails });
            }
            else {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED });
            }
        }));
        this.updateProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, fullName, phoneNumber, currentPassword, newPassword, profilePicture, markets_Traded, trading_style } = req.body;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND || 'User ID is required', });
                return;
            }
            const Expert = yield this._expertService.getExpertById(id);
            if (!Expert) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND || 'User not found', });
                return;
            }
            if (!Expert.isActive) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED, });
                return;
            }
            let password = Expert.password;
            if (currentPassword) {
                const isPasswordValid = yield passwordUtils_1.default.comparePassword(currentPassword, password);
                if (!isPasswordValid) {
                    res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: "Current Password is Wrong" });
                    return;
                }
                password = password = yield passwordUtils_1.default.passwordHash(newPassword);
            }
            const expertDetails = yield this._expertService.updateExpertById(id, { id, fullName, phoneNumber, password, profilePicture, markets_Traded, trading_style });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.PROFILE_UPDATE, expertDetails });
        }));
        this.getWallet = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            const expertDetails = yield this._expertService.getExpertById(id);
            if (!expertDetails) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            if (!expertDetails.isActive) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED });
            }
            const walletDetails = yield this._expertService.getWalletById(id);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.DATA_RETRIEVED, walletDetails });
        }));
        this._expertService = expertService;
    }
}
exports.default = ExpertController;
