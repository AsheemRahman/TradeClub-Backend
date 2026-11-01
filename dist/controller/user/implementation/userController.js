"use strict";
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
    _userService;
    _orderService;
    constructor(userService, orderService) {
        this._userService = userService;
        this._orderService = orderService;
    }
    registerPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { fullName, phoneNumber, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        // Check if email already exists
        const isEmailUsed = await this._userService.findUser(email);
        if (isEmailUsed) {
            res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ message: errorMessage_1.ERROR_MESSAGES.EMAIL_ALREADY_EXIST });
            return;
        }
        // Proceed with registration
        await this._userService.registerUser({ fullName, phoneNumber, email, password, });
        // Proceed with OTP
        const otp = await otpUtility_1.default.otpGenerator();
        await mailUtility_1.default.sendMail(email, otp, "Verification OTP");
        await this._userService.storeOtp(email, otp);
        res.status(statusCode_1.STATUS_CODES.OK).json({ message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp, });
    });
    verifyOtp = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { otp, email } = req.body;
        if (!otp || !email) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const response = await this._userService.findOtp(email);
        const storedOTP = response?.otp;
        if (storedOTP !== otp) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Incorrect OTP" });
            return;
        }
        const currentUser = await this._userService.findUser(email);
        if (!currentUser) {
            res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_VERIFIED });
    });
    resendOtp = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        if (!email) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Email is required" });
            return;
        }
        const otp = await otpUtility_1.default.otpGenerator();
        await mailUtility_1.default.sendMail(email, otp, "Verification otp");
        res.status(statusCode_1.STATUS_CODES.OK).json({ message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp, });
        await this._userService.storeResendOtp(email, otp);
    });
    loginPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const currentUser = await this._userService.validateUserCredentials(email, password);
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
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: false,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            ...(isProduction && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        };
        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000", 10), });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, httpOnly: true, maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "86400000", 10), });
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
    });
    refreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("accessToken", newAccessToken, {
            httpOnly: false,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            ...(isProduction && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
            maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000", 10),
        });
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, accessToken: newAccessToken, message: "Access token refreshed successfully" });
    });
    googleLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { fullName, email, profilePicture } = req.body;
        if (!fullName || !email || !profilePicture) {
            console.warn("Missing Google credentials");
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "name, email, and image are required.", });
            return;
        }
        let currentUser = await this._userService.findUser(email);
        if (!currentUser) {
            currentUser = await this._userService.registerUser({ fullName, email, profilePicture });
            if (!currentUser) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create user.", });
                return;
            }
        }
        else if (!currentUser?.isActive) {
            res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_BLOCKED, });
            return;
        }
        const payload = { userId: currentUser.id.toString(), role: role_1.ROLE.USER };
        const accessToken = JwtUtility_1.default.generateAccessToken(payload);
        const refreshToken = JwtUtility_1.default.generateRefreshToken(payload);
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            ...(isProduction && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        };
        res.cookie("accessToken", accessToken, { ...cookieOptions, httpOnly: false, maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000", 10), });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, httpOnly: true, maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000", 10), });
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
    });
    logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const isProduction = process.env.NODE_ENV === "production";
        const baseOptions = {
            path: "/",
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            ...(isProduction && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        };
        res.clearCookie('accessToken', { ...baseOptions, httpOnly: false });
        res.clearCookie('refreshToken', { ...baseOptions, httpOnly: true });
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.LOGOUT });
        return;
    });
    forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        if (!email) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const currentUser = await this._userService.findUser(email);
        if (!currentUser) {
            res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EMAIL_NOT_FOUND });
            return;
        }
        const response = await this._userService.findOtp(email);
        const storedOTP = response?.otp;
        if (!storedOTP) {
            const otp = await otpUtility_1.default.otpGenerator();
            await mailUtility_1.default.sendMail(email, otp, "Verification otp");
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, otp });
            await this._userService.storeOtp(email, otp);
        }
        else {
            await mailUtility_1.default.sendMail(email, Number(storedOTP), "Verification otp");
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.OTP_SENT, email, storedOTP, });
            await this._userService.storeResendOtp(email, Number(storedOTP));
        }
    });
    resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const currentUser = await this._userService.findUser(email);
        if (!currentUser) {
            res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EMAIL_NOT_FOUND });
            return;
        }
        const updateUser = await this._userService.resetPassword(email, password);
        if (updateUser) {
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Password Change successfully" });
        }
        else {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Password change failed" });
        }
    });
    getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const id = req.userId;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        const userDetails = await this._userService.getUserById(id);
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
    });
    updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id, fullName, phoneNumber, newPassword, profilePicture } = req.body;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND || 'User ID is required', });
            return;
        }
        const user = await this._userService.getUserById(id);
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
        const updatedUser = await this._userService.updateUserById(id, updateData);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.PROFILE_UPDATE, userDetails: updatedUser, });
    });
    fetchPlans = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const planData = await this._userService.fetchPlans();
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.SUBSCRIPTION_FETCH, planData });
    });
    getAllExpert = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await this._userService.getAllExpert();
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
    });
    getExpertById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        const expert = await this._userService.getExpertById(id);
        if (!expert) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Expert details fetched successfully", expert });
    });
    getExpertAvailability = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        if (!id || !startDate || !endDate) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, });
            return;
        }
        const Expert = await this._userService.getExpertById(id);
        if (!Expert) {
            res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        const availability = await this._userService.getAvailabilityByExpert(id, startDate, endDate);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Expert availability fetched successfully", availability });
    });
    checkSubscription = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND, });
            return;
        }
        const subscription = await this._userService.checkSubscription(userId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Subscription status retrieved successfully", subscription });
    });
    getSessions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND, });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const result = await this._userService.getSessions(userId, page, limit, status);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'Sessions fetched successfully', ...result, });
    });
    getSessionById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
        const session = await this._userService.getSessionById(sessionId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'Sessions fetched successfully', session });
    });
    updateSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const sessionId = req.params.id;
        const status = req.body.status;
        if (!sessionId || !status) {
            res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const session = await this._orderService.markSessionStatus(sessionId, status);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'Sessions status change successfully', session });
    });
    cancelSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
        const session = await this._orderService.cancelStatus(sessionId);
        if (session && session.status == 'canceled') {
            const userSubscription = await this._orderService.getActiveSubscription(userId);
            await this._orderService.availabityStatus(session.availabilityId);
            await this._orderService.callCountAdd(userSubscription?.id);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'Cancel Session successfully', session });
        }
        else {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: true, message: 'Failed to cancel session', session });
        }
    });
}
;
exports.default = UserController;
//# sourceMappingURL=userController.js.map