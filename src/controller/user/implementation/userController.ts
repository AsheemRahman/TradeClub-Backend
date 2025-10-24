import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage"
import { SUCCESS_MESSAGES } from "../../../constants/successMessage"
import { IUserType } from "../../../types/IUser";
import JwtUtility, { TokenPayload } from "../../../utils/JwtUtility";

import IUserController from "../IUserController";
import IUserService from "../../../service/user/IUserService";
import OtpUtility from "../../../utils/otpUtility";
import MailUtility from "../../../utils/mailUtility";
import { JwtPayload } from "jsonwebtoken";
import IOrderService from "../../../service/user/IOrderService";
import { ROLE } from "../../../constants/role";
import { asyncHandler } from "../../../utils/asyncHandler";


class UserController implements IUserController {
    private _userService: IUserService;
    private _orderService: IOrderService;

    constructor(userService: IUserService, orderService: IOrderService) {
        this._userService = userService;
        this._orderService = orderService;
    }

    registerPost = asyncHandler(async (req: Request, res: Response) => {
        const { fullName, phoneNumber, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        // Check if email already exists
        const isEmailUsed = await this._userService.findUser(email);
        if (isEmailUsed) {
            res.status(STATUS_CODES.CONFLICT).json({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXIST });
            return;
        }
        // Proceed with registration
        await this._userService.registerUser({ fullName, phoneNumber, email, password, } as IUserType);
        // Proceed with OTP
        const otp = await OtpUtility.otpGenerator();
        await MailUtility.sendMail(email, otp, "Verification OTP");
        await this._userService.storeOtp(email, otp);
        res.status(STATUS_CODES.OK).json({ message: SUCCESS_MESSAGES.OTP_SENT, email, otp, });
    });

    verifyOtp = asyncHandler(async (req: Request, res: Response) => {
        const { otp, email } = req.body;
        if (!otp || !email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const response = await this._userService.findOtp(email);
        const storedOTP = response?.otp;
        if (storedOTP !== otp) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Incorrect OTP" });
            return;
        }
        const currentUser = await this._userService.findUser(email);
        if (!currentUser) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.OTP_VERIFIED });
    });

    resendOtp = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Email is required" });
            return;
        }
        const otp = await OtpUtility.otpGenerator();
        await MailUtility.sendMail(email, otp, "Verification otp");
        res.status(STATUS_CODES.OK).json({ message: SUCCESS_MESSAGES.OTP_SENT, email, otp, });
        await this._userService.storeResendOtp(email, otp);
    });

    loginPost = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
            const currentUser = await this._userService.validateUserCredentials(email, password);
            if (!currentUser) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: "Invalid email or password" });
                return;
            }

            if (!currentUser.isActive) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_BLOCKED });
                return;
            }
            const payload = { userId: (currentUser.id as string).toString(), role: ROLE.USER };
            const accessToken = JwtUtility.generateAccessToken(payload);
            const refreshToken = JwtUtility.generateRefreshToken(payload);
        res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000") });
            res.status(STATUS_CODES.OK).json({
                status: true, message: SUCCESS_MESSAGES.LOGIN,
                data: {
                    accessToken,
                    user: {
                        id: currentUser.id,
                        email: currentUser.email,
                        name: currentUser.fullName,
                        role: ROLE.USER
                    }
                }
            });
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING });
            return;
        }
        // Verify the refresh token using JwtUtility
        let decoded: string | JwtPayload;
        try {
            decoded = JwtUtility.verifyToken(refreshToken, true);
        } catch (err) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING });
            return
        }
        const { role, userId } = decoded as TokenPayload;
        if (!userId || !role) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.INVALID_REFRESH_TOKEN });
            return
        }
        const newAccessToken = JwtUtility.generateAccessToken({ userId, role });
        res.cookie("accessToken", newAccessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
        res.status(STATUS_CODES.OK).json({ status: true, accessToken: newAccessToken, message: "Access token refreshed successfully" });
    });

    googleLogin = asyncHandler(async (req: Request, res: Response) => {
        const { fullName, email, profilePicture } = req.body;
        if (!fullName || !email || !profilePicture) {
            console.warn("Missing Google credentials");
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "name, email, and image are required.", });
            return
        }
        let currentUser = await this._userService.findUser(email);
        if (!currentUser) {
            currentUser = await this._userService.registerUser({ fullName, email, profilePicture } as IUserType);
            if (!currentUser) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create user.", });
                return
            }
        } else if (!currentUser?.isActive) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.USER_BLOCKED, });
            return;
        }
        const payload = { userId: (currentUser.id as string).toString(), role: ROLE.USER };
        const accessToken = JwtUtility.generateAccessToken(payload);
        const refreshToken = JwtUtility.generateRefreshToken(payload);
        res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000") });
        res.status(STATUS_CODES.OK).json({
            status: true, message: SUCCESS_MESSAGES.LOGIN, accessToken,
            data: {
                accessToken,
                user: {
                    id: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.fullName,
                    role: ROLE.USER
                }
            }
        });
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none", });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none", });
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.LOGOUT });
        return
    });

    forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const currentUser = await this._userService.findUser(email);
        if (!currentUser) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.EMAIL_NOT_FOUND });
            return;
        }
        const response = await this._userService.findOtp(email);
        const storedOTP = response?.otp;
        if (!storedOTP) {
            const otp = await OtpUtility.otpGenerator();
            await MailUtility.sendMail(email, otp, "Verification otp");
            res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.OTP_SENT, email, otp });
            await this._userService.storeOtp(email, otp);
        } else {
            await MailUtility.sendMail(email, Number(storedOTP), "Verification otp");
            res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.OTP_SENT, email, storedOTP, });
            await this._userService.storeResendOtp(email, Number(storedOTP));
        }
    });

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const currentUser = await this._userService.findUser(email);
        if (!currentUser) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.EMAIL_NOT_FOUND });
            return;
        }
        const updateUser = await this._userService.resetPassword(email, password);
        if (updateUser) {
            res.status(STATUS_CODES.OK).json({ status: true, message: "Password Change successfully" });
        } else {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Password change failed" });
        }
    });

    getProfile = asyncHandler(async (req: Request, res: Response) => {
        const id = req.userId
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        const userDetails = await this._userService.getUserById(id)
        if (!userDetails) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        if (userDetails.isActive) {
            res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.DATA_RETRIEVED, userDetails });
        } else {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_BLOCKED });
        }
    });

    updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const { id, fullName, phoneNumber, newPassword, profilePicture } = req.body;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User ID is required', });
            return;
        }
        const user = await this._userService.getUserById(id);
        if (!user) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User not found', });
            return;
        }
        if (!user.isActive) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.USER_BLOCKED, });
            return;
        }
        const updateData: any = {};
        if (fullName) updateData.fullName = fullName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (newPassword) updateData.password = newPassword;
        if (profilePicture) updateData.profilePicture = profilePicture;
        const updatedUser = await this._userService.updateUserById(id, updateData);
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.PROFILE_UPDATE, userDetails: updatedUser, });
    });

    fetchPlans = asyncHandler(async (req: Request, res: Response) => {
        const planData = await this._userService.fetchPlans();
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.SUBSCRIPTION_FETCH, planData })
    });

    getAllExpert = asyncHandler(async (req: Request, res: Response) => {
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
        res.status(STATUS_CODES.OK).json({
            status: true, message: "Experts fetched successfully",
            data: {
                experts: formattedExperts,
                // expertCount: response.total
            },
        });
    });

    getExpertById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return;
        }
        const expert = await this._userService.getExpertById(id)
        if (!expert) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        res.status(STATUS_CODES.OK).json({ status: true, message: "Expert details fetched successfully", expert });
    });

    getExpertAvailability = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;
        if (!id || !startDate || !endDate) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, });
            return;
        }
        const Expert = await this._userService.getExpertById(id)
        if (!Expert) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        const availability = await this._userService.getAvailabilityByExpert(id, startDate, endDate);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Expert availability fetched successfully", availability });
    });

    checkSubscription = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND, });
            return;
        }
        const subscription = await this._userService.checkSubscription(userId)
        res.status(STATUS_CODES.OK).json({ status: true, message: "Subscription status retrieved successfully", subscription });
    });

    getSessions = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND, });
            return;
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const result = await this._userService.getSessions(userId, page, limit, status);
        res.status(STATUS_CODES.OK).json({ status: true, message: 'Sessions fetched successfully', ...result, });
    });

    getSessionById = asyncHandler(async (req: Request, res: Response) => {
        const sessionId = req.params.id
        // const userId = req.userId;
        // if (!userId) {
        //     res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND, });
        //     return;
        // }
        if (!sessionId) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const session = await this._userService.getSessionById(sessionId);
        res.status(STATUS_CODES.OK).json({ status: true, message: 'Sessions fetched successfully', session });
    });

    updateSession = asyncHandler(async (req: Request, res: Response) => {
        const sessionId = req.params.id
        const status = req.body.status
        if (!sessionId || !status) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const session = await this._orderService.markSessionStatus(sessionId, status);
        res.status(STATUS_CODES.OK).json({ status: true, message: 'Sessions status change successfully', session });
    });

    cancelSession = asyncHandler(async (req: Request, res: Response) => {
        const sessionId = req.params.id
        if (!sessionId) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND, });
            return;
        }
        const session = await this._orderService.cancelStatus(sessionId);
        if (session && session.status == 'canceled') {
            const userSubscription = await this._orderService.getActiveSubscription(userId)
            await this._orderService.availabityStatus(session.availabilityId)
            await this._orderService.callCountAdd(userSubscription?.id)
            res.status(STATUS_CODES.OK).json({ status: true, message: 'Cancel Session successfully', session });
        } else {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: true, message: 'Failed to cancel session', session });
        }
    });
};


export default UserController;