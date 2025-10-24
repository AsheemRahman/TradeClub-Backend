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
const JwtUtility_1 = __importDefault(require("../../../utils/JwtUtility"));
const otpUtility_1 = __importDefault(require("../../../utils/otpUtility"));
const mailUtility_1 = __importDefault(require("../../../utils/mailUtility"));
const role_1 = require("../../../constants/role");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class UserController {
    constructor(userService, orderService) {
        this.registerPost = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fullName, phoneNumber, email, password } = req.body;
            if (!fullName || !email || !password) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            // Check if email already exists
            const isEmailUsed = yield this._userService.findUser(email);
            if (isEmailUsed) {
                res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ message: errorMessage_1.ERROR_MESSAGES.EMAIL_ALREADY_EXIST });
                return;
            }
            // Proceed with registration
            yield this._userService.registerUser({ fullName, phoneNumber, email, password, });
            // Proceed with OTP
            const otp = yield otpUtility_1.default.otpGenerator();
            yield mailUtility_1.default.sendMail(email, otp, "Verification OTP");
            yield this._userService.storeOtp(email, otp);
            res.status(statusCode_1.STATUS_CODES.OK).json({ message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp, });
        }));
        this.verifyOtp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = req.body;
            if (!otp || !email) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const response = yield this._userService.findOtp(email);
            const storedOTP = response === null || response === void 0 ? void 0 : response.otp;
            if (storedOTP !== otp) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Incorrect OTP" });
                return;
            }
            const currentUser = yield this._userService.findUser(email);
            if (!currentUser) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_VERIFIED });
        }));
        this.resendOtp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Email is required" });
                return;
            }
            const otp = yield otpUtility_1.default.otpGenerator();
            yield mailUtility_1.default.sendMail(email, otp, "Verification otp");
            res.status(statusCode_1.STATUS_CODES.OK).json({ message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp, });
            yield this._userService.storeResendOtp(email, otp);
        }));
        this.loginPost = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const currentUser = yield this._userService.validateUserCredentials(email, password);
            if (!currentUser) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: "Invalid email or password" });
                return;
            }
            if (!currentUser.isActive) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED });
                return;
            }
            const payload = { userId: currentUser.id.toString(), role: role_1.ROLE.USER };
            const accessToken = JwtUtility_1.default.generateAccessToken(payload);
            const refreshToken = JwtUtility_1.default.generateRefreshToken(payload);
            res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000") });
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true, message: successMessage_1.SUCCESS_MESSAGES.LOGIN,
                data: {
                    accessToken,
                    user: {
                        id: currentUser.id,
                        email: currentUser.email,
                        name: currentUser.fullName,
                        role: role_1.ROLE.USER
                    }
                }
            });
        }));
        this.refreshToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.REFRESH_TOKEN_MISSING });
                return;
            }
            // Verify the refresh token using JwtUtility
            let decoded;
            try {
                decoded = JwtUtility_1.default.verifyToken(refreshToken, true);
            }
            catch (err) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.REFRESH_TOKEN_MISSING });
                return;
            }
            const { role, userId } = decoded;
            if (!userId || !role) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN });
                return;
            }
            const newAccessToken = JwtUtility_1.default.generateAccessToken({ userId, role });
            res.cookie("accessToken", newAccessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, accessToken: newAccessToken, message: "Access token refreshed successfully" });
        }));
        this.googleLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fullName, email, profilePicture } = req.body;
            if (!fullName || !email || !profilePicture) {
                console.warn("Missing Google credentials");
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "name, email, and image are required.", });
                return;
            }
            let currentUser = yield this._userService.findUser(email);
            if (!currentUser) {
                currentUser = yield this._userService.registerUser({ fullName, email, profilePicture });
                if (!currentUser) {
                    res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create user.", });
                    return;
                }
            }
            else if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isActive)) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED, });
                return;
            }
            const payload = { userId: currentUser.id.toString(), role: role_1.ROLE.USER };
            const accessToken = JwtUtility_1.default.generateAccessToken(payload);
            const refreshToken = JwtUtility_1.default.generateRefreshToken(payload);
            res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000") });
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true, message: successMessage_1.SUCCESS_MESSAGES.LOGIN, accessToken,
                data: {
                    accessToken,
                    user: {
                        id: currentUser.id,
                        email: currentUser.email,
                        name: currentUser.fullName,
                        role: role_1.ROLE.USER
                    }
                }
            });
        }));
        this.logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.LOGOUT });
            return;
        }));
        this.forgotPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const currentUser = yield this._userService.findUser(email);
            if (!currentUser) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EMAIL_NOT_FOUND });
                return;
            }
            const response = yield this._userService.findOtp(email);
            const storedOTP = response === null || response === void 0 ? void 0 : response.otp;
            if (!storedOTP) {
                const otp = yield otpUtility_1.default.otpGenerator();
                yield mailUtility_1.default.sendMail(email, otp, "Verification otp");
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp });
                yield this._userService.storeOtp(email, otp);
            }
            else {
                yield mailUtility_1.default.sendMail(email, Number(storedOTP), "Verification otp");
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, storedOTP, });
                yield this._userService.storeResendOtp(email, Number(storedOTP));
            }
        }));
        this.resetPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const currentUser = yield this._userService.findUser(email);
            if (!currentUser) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EMAIL_NOT_FOUND });
                return;
            }
            const updateUser = yield this._userService.resetPassword(email, password);
            if (updateUser) {
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Password Change successfully" });
            }
            else {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Password change failed" });
            }
        }));
        this.getProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            const userDetails = yield this._userService.getUserById(id);
            if (!userDetails) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            if (userDetails.isActive) {
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.DATA_RETRIEVED, userDetails });
            }
            else {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED });
            }
        }));
        this.updateProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, fullName, phoneNumber, newPassword, profilePicture } = req.body;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND || 'User ID is required', });
                return;
            }
            const user = yield this._userService.getUserById(id);
            if (!user) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND || 'User not found', });
                return;
            }
            if (!user.isActive) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED, });
                return;
            }
            const updateData = {};
            if (fullName)
                updateData.fullName = fullName;
            if (phoneNumber)
                updateData.phoneNumber = phoneNumber;
            if (newPassword)
                updateData.password = newPassword;
            if (profilePicture)
                updateData.profilePicture = profilePicture;
            const updatedUser = yield this._userService.updateUserById(id, updateData);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.PROFILE_UPDATE, userDetails: updatedUser, });
        }));
        this.fetchPlans = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const planData = yield this._userService.fetchPlans();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.SUBSCRIPTION_FETCH, planData });
        }));
        this.getAllExpert = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._userService.getAllExpert();
            const expert = response || [];
            const formattedExperts = expert.map((expert) => ({
                id: expert._id,
                fullName: expert.fullName,
                isActive: expert.isActive,
                profilePicture: expert.profilePicture,
                experience_level: expert.experience_level,
                year_of_experience: expert.year_of_experience,
                markets_Traded: expert.markets_Traded,
                trading_style: expert.trading_style,
                state: expert.state,
                country: expert.country,
                isVerified: expert.isVerified,
                createdAt: expert.createdAt
            }));
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true, message: "Experts fetched successfully",
                data: {
                    experts: formattedExperts,
                    // expertCount: response.total
                },
            });
        }));
        this.getExpertById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            const expert = yield this._userService.getExpertById(id);
            if (!expert) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Expert details fetched successfully", expert });
        }));
        this.getExpertAvailability = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            if (!id || !startDate || !endDate) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, });
                return;
            }
            const Expert = yield this._userService.getExpertById(id);
            if (!Expert) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            const availability = yield this._userService.getAvailabilityByExpert(id, startDate, endDate);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Expert availability fetched successfully", availability });
        }));
        this.checkSubscription = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND, });
                return;
            }
            const subscription = yield this._userService.checkSubscription(userId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Subscription status retrieved successfully", subscription });
        }));
        this.getSessions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND, });
                return;
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const result = yield this._userService.getSessions(userId, page, limit, status);
            res.status(statusCode_1.STATUS_CODES.OK).json(Object.assign({ status: true, message: 'Sessions fetched successfully' }, result));
        }));
        this.getSessionById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const sessionId = req.params.id;
            // const userId = req.userId;
            // if (!userId) {
            //     res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND, });
            //     return;
            // }
            if (!sessionId) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const session = yield this._userService.getSessionById(sessionId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'Sessions fetched successfully', session });
        }));
        this.updateSession = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const sessionId = req.params.id;
            const status = req.body.status;
            if (!sessionId || !status) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const session = yield this._orderService.markSessionStatus(sessionId, status);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'Sessions status change successfully', session });
        }));
        this.cancelSession = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const sessionId = req.params.id;
            if (!sessionId) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND, });
                return;
            }
            const session = yield this._orderService.cancelStatus(sessionId);
            if (session && session.status == 'canceled') {
                const userSubscription = yield this._orderService.getActiveSubscription(userId);
                yield this._orderService.availabityStatus(session.availabilityId);
                yield this._orderService.callCountAdd(userSubscription === null || userSubscription === void 0 ? void 0 : userSubscription.id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'Cancel Session successfully', session });
            }
            else {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: true, message: 'Failed to cancel session', session });
            }
        }));
        this._userService = userService;
        this._orderService = orderService;
    }
}
;
exports.default = UserController;
