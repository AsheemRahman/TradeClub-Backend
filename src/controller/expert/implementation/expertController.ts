import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage"
import { SUCCESS_MESSAGES } from "../../../constants/successMessage"
import { IUserType } from "../../../types/IUser";
import { ExpertFormData } from "../../../types/IExpert";

import IExpertController from "../IExpertController";
import IExpertService from "../../../service/expert/IExpertService";

import OtpUtility from "../../../utils/otpUtility";
import MailUtility from "../../../utils/mailUtility";
import PasswordUtils from "../../../utils/passwordUtils";
import JwtUtility from "../../../utils/JwtUtility";
import { ROLE } from "../../../constants/role";
import { asyncHandler } from "../../../utils/asyncHandler";


class ExpertController implements IExpertController {
    private _expertService: IExpertService;

    constructor(expertService: IExpertService) {
        this._expertService = expertService;
    }

    //----------------------------- Expert Register -----------------------------

    registerPost = asyncHandler(async (req: Request, res: Response) => {
        const { fullName, phoneNumber, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const isEmailUsed = await this._expertService.findExpertByEmail(email);
        if (isEmailUsed) {
            res.status(STATUS_CODES.CONFLICT).json({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXIST });
            return;
        }
        await this._expertService.registerExpert({ fullName, phoneNumber, email, password, } as IUserType);
        const otp = await OtpUtility.otpGenerator();
        await MailUtility.sendMail(email, otp, "Verification OTP");
        await this._expertService.storeOtp(email, otp);
        res.status(STATUS_CODES.OK).json({ message: SUCCESS_MESSAGES.OTP_SENT, email, otp, });
    });

    //---------------------------- Expert verify OTP ----------------------------

    verifyOtp = asyncHandler(async (req: Request, res: Response) => {
        const { otp, email } = req.body;
        if (!otp || !email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const response = await this._expertService.findOtp(email);
        const storedOTP = response?.otp;
        if (storedOTP !== otp) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Incorrect OTP" });
            return;
        }
        const currentExpert = await this._expertService.findExpertByEmail(email);
        if (!currentExpert) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.EXPERT_NOT_FOUND });
            return;
        }
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.OTP_VERIFIED });
    });

    //---------------------------- Expert Resend OTP ----------------------------

    resendOtp = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Email is required" });
            return;
        }
        const otp = await OtpUtility.otpGenerator();
        await MailUtility.sendMail(email, otp, "Verification otp");
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.OTP_SENT, email, otp, });
        await this._expertService.storeResendOtp(email, otp);
    });

    //------------------------------- Expert Login -------------------------------

    loginPost = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const currentExpert = await this._expertService.findExpertByEmail(email);
        if (!currentExpert) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.EMAIL_NOT_FOUND });
            return;
        }
        if (!currentExpert.password) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "User is login by google" });
            return;
        }
        if (!currentExpert.isActive) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "Expert is Blocked by Admin." });
            return;
        }
        const isPasswordValid = await PasswordUtils.comparePassword(password, currentExpert.password);
        if (!isPasswordValid) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS, data: null });
            return;
        }
        const payload = {
            userId: (currentExpert._id as string).toString(),
            role: ROLE.EXPERT
        };
        const accessToken = JwtUtility.generateAccessToken(payload);
        const refreshToken = JwtUtility.generateRefreshToken(payload);
        res.cookie("accessToken", accessToken, { httpOnly: false, domain: process.env.COOKIE_DOMAIN, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, domain: process.env.COOKIE_DOMAIN, secure: true, sameSite: "none", maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000") });
        res.status(STATUS_CODES.OK).json({
            status: true, message: SUCCESS_MESSAGES.LOGIN,
            data: {
                accessToken,
                expert: {
                    id: currentExpert._id,
                    email: currentExpert.email,
                    name: currentExpert.fullName,
                    isVerified: currentExpert.isVerified,
                    role: ROLE.EXPERT
                }
            }
        });
    });

    googleLogin = asyncHandler(async (req: Request, res: Response) => {
        const { fullName, email, profilePicture } = req.body;
        if (!fullName || !email || !profilePicture) {
            console.warn("Missing Google credentials");
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "name, email, and image are required.", });
            return
        }
        let currentExpert = await this._expertService.findExpertByEmail(email);
        if (!currentExpert) {
            currentExpert = await this._expertService.registerExpert({ fullName, email, profilePicture, } as IUserType);
            if (!currentExpert) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create user.", });
                return
            }
        } else if (!currentExpert?.isActive) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.USER_BLOCKED, });
            return;
        }
        const payload = { userId: (currentExpert._id as string).toString(), role: ROLE.EXPERT };
        const accessToken = JwtUtility.generateAccessToken(payload);
        const refreshToken = JwtUtility.generateRefreshToken(payload);
        res.cookie("accessToken", accessToken, { httpOnly: false, domain: process.env.COOKIE_DOMAIN, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, domain: process.env.COOKIE_DOMAIN, secure: true, sameSite: "none", maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000") });
        res.status(STATUS_CODES.OK).json({
            status: true, message: SUCCESS_MESSAGES.LOGIN,
            data: {
                accessToken,
                expert: {
                    id: currentExpert._id,
                    email: currentExpert.email,
                    name: currentExpert.fullName,
                    role: ROLE.EXPERT,
                    isVerified: currentExpert.isVerified,
                }
            }
        });
    });

    //------------------------- Expert Forgot Password -------------------------

    forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const currentExpert = await this._expertService.findExpertByEmail(email);
        if (!currentExpert) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.EMAIL_NOT_FOUND });
            return;
        }
        const response = await this._expertService.findOtp(email);
        const storedOTP = response?.otp;
        if (!storedOTP) {
            const otp = await OtpUtility.otpGenerator();
            await MailUtility.sendMail(email, otp, "Verification otp");
            res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.OTP_SENT, email, otp });
            await this._expertService.storeOtp(email, otp);
        } else {
            await MailUtility.sendMail(email, Number(storedOTP), "Verification otp");
            res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.OTP_SENT, email, storedOTP, });
            await this._expertService.storeResendOtp(email, Number(storedOTP));
        }
    });

    //--------------------------- Expert reset Password ---------------------------

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const currentUser = await this._expertService.findExpertByEmail(email);
        if (!currentUser) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.EMAIL_NOT_FOUND });
            return;
        }
        const updateExpert = await this._expertService.resetPassword(email, password);
        if (updateExpert) {
            res.status(STATUS_CODES.OK).json({ status: true, message: "Password Change successfuly" });
        } else {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Password change failed" });
        }
    });

    //---------------------------- Expert verification ----------------------------

    expertVerification = asyncHandler(async (req: Request, res: Response) => {
        const { email, phoneNumber, profilePicture, DOB, state, country, experience_level, markets_Traded, trading_style, proof_of_experience, year_of_experience, Introduction_video, Government_Id, selfie_Id } = req.body;
        if (!email || !phoneNumber || !profilePicture || !DOB || !state || !country || !experience_level || !markets_Traded || !trading_style || !proof_of_experience || !year_of_experience || !Introduction_video || !Government_Id || !selfie_Id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const isExpert = await this._expertService.findExpertByEmail(email);
        if (!isExpert) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.EMAIL_NOT_FOUND });
            return;
        }
        await this._expertService.updateDetails({ email, phoneNumber, profilePicture, DOB, state, country, experience_level, markets_Traded, trading_style, proof_of_experience, year_of_experience, Introduction_video, Government_Id, selfie_Id } as ExpertFormData);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Expert details added successfully", });
    });


    logout = asyncHandler(async (req: Request, res: Response) => {
        const baseOptions = {
            domain: process.env.COOKIE_DOMAIN,
            path: '/',
            secure: true,
            sameSite: 'none' as const,
        };
        res.clearCookie('accessToken', { ...baseOptions, httpOnly: false });
        res.clearCookie('refreshToken', { ...baseOptions, httpOnly: true });
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.LOGOUT });
        return
    });

    getExpertData = asyncHandler(async (req: Request, res: Response) => {
        const id = req.userId
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        const expertDetails = await this._expertService.getExpertById(id)
        if (!expertDetails) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        if (expertDetails.isActive) {
            res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.DATA_RETRIEVED, expertDetails });
        } else {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_BLOCKED });
        }
    });

    updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const { id, fullName, phoneNumber, currentPassword, newPassword, profilePicture, markets_Traded, trading_style } = req.body;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User ID is required', });
            return;
        }
        const Expert = await this._expertService.getExpertById(id);
        if (!Expert) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User not found', });
            return;
        }
        if (!Expert.isActive) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.USER_BLOCKED, });
            return;
        }
        let password = Expert.password;
        if (currentPassword) {
            const isPasswordValid = await PasswordUtils.comparePassword(currentPassword, password);
            if (!isPasswordValid) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: "Current Password is Wrong" });
                return;
            }
            password = password = await PasswordUtils.passwordHash(newPassword);
        }
        const expertDetails = await this._expertService.updateExpertById(id, { id, fullName, phoneNumber, password, profilePicture, markets_Traded, trading_style });
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.PROFILE_UPDATE, expertDetails });
    });

    getWallet = asyncHandler(async (req: Request, res: Response) => {
        const id = req.userId
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        const expertDetails = await this._expertService.getExpertById(id)
        if (!expertDetails) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        if (!expertDetails.isActive) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_BLOCKED });
        }
        const walletDetails = await this._expertService.getWalletById(id);
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.DATA_RETRIEVED, walletDetails });
    });
}




export default ExpertController;