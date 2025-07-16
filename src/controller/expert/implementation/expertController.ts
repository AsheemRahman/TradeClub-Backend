import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"
import { IUserType } from "../../../types/IUser";
import { ExpertFormData } from "../../../types/IExpert";

import IExpertController from "../IExpertController";
import IExpertService from "../../../service/expert/IExpertService";

import OtpUtility from "../../../utils/otpUtility";
import MailUtility from "../../../utils/mailUtility";
import PasswordUtils from "../../../utils/passwordUtils";
import JwtUtility from "../../../utils/JwtUtility";


class ExpertController implements IExpertController {
    private expertService: IExpertService;

    constructor(expertService: IExpertService) {
        this.expertService = expertService;
    }

    //----------------------------- Expert Register -----------------------------

    async registerPost(req: Request, res: Response): Promise<void> {
        try {
            const { fullName, phoneNumber, email, password } = req.body;
            if (!fullName || !email || !password) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const isEmailUsed = await this.expertService.findExpertByEmail(email);
            if (isEmailUsed) {
                res.status(STATUS_CODES.CONFLICT).json({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXIST });
                return;
            }
            await this.expertService.registerExpert({ fullName, phoneNumber, email, password, } as IUserType);
            const otp = await OtpUtility.otpGenerator();
            try {
                await MailUtility.sendMail(email, otp, "Verification OTP");
                await this.expertService.storeOtp(email, otp);
                res.status(STATUS_CODES.OK).json({ message: "An otp has sent to your email", email, otp, });
            } catch (error) {
                console.error("Failed to send OTP:", error);
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.ERROR_SENDING_OTP });
            }
        } catch (error) {
            console.error("Error during signup:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : error
            });
        }
    }

    //---------------------------- Expert verify OTP ----------------------------

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const { otp, email } = req.body;
        try {
            if (!otp || !email) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const response = await this.expertService.findOtp(email);
            const storedOTP = response?.otp;
            if (storedOTP !== otp) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Incorrect OTP" });
                return;
            }
            const currentExpert = await this.expertService.findExpertByEmail(email);
            if (!currentExpert) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.Expert_NOT_FOUND });
                return;
            }
            res.status(STATUS_CODES.OK).json({ status: true, message: "OTP verified successfully" });
        } catch (error) {
            console.error("Error during OTP verify:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : error
            });
        }
    }

    //---------------------------- Expert Resend OTP ----------------------------

    async resendOtp(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Email is required" });
            return;
        }
        const otp = await OtpUtility.otpGenerator();
        try {
            await MailUtility.sendMail(email, otp, "Verification otp");
            res.status(STATUS_CODES.OK).json({ status: true, message: "Otp sent to the given mail id", email, otp, });
            await this.expertService.storeResendOtp(email, otp);
        } catch (error) {
            console.error("Failed to send otp", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to send the verification mail" });
        }
    }

    //------------------------------- Expert Login -------------------------------

    async loginPost(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        try {
            const currentExpert = await this.expertService.findExpertByEmail(email);
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
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: "Invalid email or password", data: null });
                return;
            }
            const payload = {
                userId: (currentExpert._id as string).toString(),
                role: "expert"
            };
            const accessToken = JwtUtility.generateAccessToken(payload);
            const refreshToken = JwtUtility.generateRefreshToken(payload);
            res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: 24 * 60 * 1000, });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, });
            res.status(STATUS_CODES.OK).json({
                status: true, message: "Login successful",
                data: {
                    accessToken,
                    expert: {
                        id: currentExpert._id,
                        email: currentExpert.email,
                        name: currentExpert.fullName,
                        isVerified: currentExpert.isVerified,
                        role: "expert"
                    }
                }
            });
        } catch (error) {
            console.error("Login Error:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, });
        }
    }

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { fullName, email, profilePicture } = req.body;
            if (!fullName || !email || !profilePicture) {
                console.warn("Missing Google credentials");
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "name, email, and image are required.", });
                return
            }
            let currentExpert = await this.expertService.findExpertByEmail(email);
            if (!currentExpert) {
                currentExpert = await this.expertService.registerExpert({ fullName, email, profilePicture, } as IUserType);
                if (!currentExpert) {
                    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create user.", });
                    return
                }
            } else if (!currentExpert?.isActive) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: 'User is blocked by admin', });
                return;
            }
            const payload = { userId: (currentExpert._id as string).toString(), role: "expert" };
            const accessToken = JwtUtility.generateAccessToken(payload);
            const refreshToken = JwtUtility.generateRefreshToken(payload);
            res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: 24 * 60 * 1000, });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, });
            res.status(STATUS_CODES.OK).json({
                status: true, message: "Login successful",
                data: {
                    accessToken,
                    expert: {
                        id: currentExpert._id,
                        email: currentExpert.email,
                        name: currentExpert.fullName,
                        role: "expert",
                        isVerified: currentExpert.isVerified,
                    }
                }
            });
        } catch (error) {
            console.error("Error during Google auth:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            return
        }
    }

    //------------------------- Expert Forgot Password -------------------------

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        try {
            const currentExpert = await this.expertService.findExpertByEmail(email);
            if (!currentExpert) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "Email is not registered." });
                return;
            }
            const response = await this.expertService.findOtp(email);
            const storedOTP = response?.otp;
            if (!storedOTP) {
                const otp = await OtpUtility.otpGenerator();
                await MailUtility.sendMail(email, otp, "Verification otp");
                res.status(STATUS_CODES.OK).json({ status: true, message: "Otp sent to the given mail id", email, otp });
                await this.expertService.storeOtp(email, otp);
            } else {
                await MailUtility.sendMail(email, Number(storedOTP), "Verification otp");
                res.status(STATUS_CODES.OK).json({ status: true, message: "Otp sent to the given mail id", email, storedOTP, });
                await this.expertService.storeResendOtp(email, Number(storedOTP));
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, });
        }
    }

    //--------------------------- Expert reset Password ---------------------------

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        try {
            const currentUser = await this.expertService.findExpertByEmail(email);
            if (!currentUser) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "Email is not registered." });
                return;
            }
            const updateExpert = await this.expertService.resetPassword(email, password);
            if (updateExpert) {
                res.status(STATUS_CODES.OK).json({ status: true, message: "Password Change successfuly" });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Password change failed" });
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, });
        }
    }

    //---------------------------- Expert verification ----------------------------

    async expertVerification(req: Request, res: Response): Promise<void> {
        try {
            const { email, phoneNumber, profilePicture, DOB, state, country, experience_level, markets_Traded, trading_style, proof_of_experience, year_of_experience, Introduction_video, Government_Id, selfie_Id } = req.body;
            if (!email || !phoneNumber || !profilePicture || !DOB || !state || !country || !experience_level || !markets_Traded || !trading_style || !proof_of_experience || !year_of_experience || !Introduction_video || !Government_Id || !selfie_Id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const isExpert = await this.expertService.findExpertByEmail(email);
            if (!isExpert) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "Email is not registered." });
                return;
            }
            await this.expertService.updateDetails({ email, phoneNumber, profilePicture, DOB, state, country, experience_level, markets_Traded, trading_style, proof_of_experience, year_of_experience, Introduction_video, Government_Id, selfie_Id } as ExpertFormData);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Expert details added successfully", });
        } catch (error) {
            console.error("Get expert verification error:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, error: "Error verifying expert details", });
        }
    }


    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.status(STATUS_CODES.OK).json({ status: true, message: "Logout successful", });
            return
        } catch (error) {
            console.error("Logout error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ error: "logout failed" });
            return
        }
    }

    async getExpertData(req: Request, res: Response): Promise<void> {
        try {
            const id = req.userId
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            const expertDetails = await this.expertService.getExpertById(id)
            if (!expertDetails) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            if (expertDetails.isActive) {
                res.status(STATUS_CODES.OK).json({ status: true, message: "Data retrieved successfully", expertDetails });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "User Is blocked by admin" });
            }
        } catch (error) {
            console.error("Profile error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ error: "get Profile failed" });
            return
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const { id, fullName, phoneNumber, currentPassword, newPassword, profilePicture, markets_Traded, trading_style } = req.body;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User ID is required', });
                return;
            }
            const Expert = await this.expertService.getExpertById(id);
            if (!Expert) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User not found', });
                return;
            }
            if (!Expert.isActive) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: 'User is blocked by admin', });
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
            const expertDetails = await this.expertService.updateExpertById(id, { id, fullName, phoneNumber, password, profilePicture, markets_Traded, trading_style });
            res.status(STATUS_CODES.OK).json({ status: true, message: 'Profile updated successfully', expertDetails });
        } catch (error) {
            console.error('Update Profile Error:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Failed to update profile', });
        }
    }

    async getWallet(req: Request, res: Response): Promise<void> {
        try {
            const id = req.userId
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            const expertDetails = await this.expertService.getExpertById(id)
            if (!expertDetails) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            if (!expertDetails.isActive) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "User Is blocked by admin" });
            }
            const walletDetails = await this.expertService.getWalletById(id);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Data retrieved successfully", walletDetails });
        } catch (error) {
            console.error("Profile error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ error: "get Profile failed" });
            return
        }
    }
}




export default ExpertController;