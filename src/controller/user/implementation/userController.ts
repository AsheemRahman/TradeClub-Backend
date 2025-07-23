import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"
import { IUserType } from "../../../types/IUser";
import JwtUtility, { TokenPayload } from "../../../utils/JwtUtility";


import IUserController from "../IUserController";
import IUserService from "../../../service/user/IUserService";
import OtpUtility from "../../../utils/otpUtility";
import MailUtility from "../../../utils/mailUtility";
import PasswordUtils from "../../../utils/passwordUtils";
import { JwtPayload } from "jsonwebtoken";



class UserController implements IUserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async registerPost(req: Request, res: Response): Promise<void> {
        try {
            const { fullName, phoneNumber, email, password } = req.body;
            if (!fullName || !email || !password) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            // Check if email already exists
            const isEmailUsed = await this.userService.findUser(email);
            if (isEmailUsed) {
                res.status(STATUS_CODES.CONFLICT).json({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXIST });
                return;
            }
            // Proceed with registration
            await this.userService.registerUser({ fullName, phoneNumber, email, password, } as IUserType);
            // Proceed with OTP
            const otp = await OtpUtility.otpGenerator();
            try {
                await MailUtility.sendMail(email, otp, "Verification OTP");
                await this.userService.storeOtp(email, otp);
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

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const { otp, email } = req.body;
        if (!otp || !email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        try {
            const response = await this.userService.findOtp(email);
            const storedOTP = response?.otp;
            if (storedOTP !== otp) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Incorrect OTP" });
                return;
            }
            const currentUser = await this.userService.findUser(email);
            if (!currentUser) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            res.status(STATUS_CODES.OK).json({ status: true, message: "OTP verified successfully" });
        } catch (error) {
            console.error("Failed to send otp", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to send the verification mail" });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Email is required" });
            return;
        }
        const otp = await OtpUtility.otpGenerator();
        try {
            await MailUtility.sendMail(email, otp, "Verification otp");
            res.status(STATUS_CODES.OK).json({ message: "Otp sent to the given mail id", email, otp, });
            await this.userService.storeResendOtp(email, otp);
        } catch (error) {
            console.error("Failed to send otp", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to send the verification mail" });
        }
    }

    async loginPost(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        try {
            const currentUser = await this.userService.findUser(email);
            if (!currentUser || !currentUser.password) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "Email is not registered." });
                return;
            }
            if (!currentUser.isActive) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "User is Blocked by Admin." });
                return;
            }
            const isPasswordValid = await PasswordUtils.comparePassword(password, currentUser.password);
            if (!isPasswordValid) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: "Invalid email or password", data: null });
                return;
            }
            const payload = { userId: (currentUser._id as string).toString(), role: "user" };
            const accessToken = JwtUtility.generateAccessToken(payload);
            const refreshToken = JwtUtility.generateRefreshToken(payload);
            res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: 24 * 60 * 1000, });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, });
            res.status(STATUS_CODES.OK).json({
                status: true, message: "Login successful",
                data: {
                    accessToken,
                    user: {
                        id: currentUser._id,
                        email: currentUser.email,
                        name: currentUser.fullName,
                        role: "user"
                    }
                }
            });
        } catch (error) {
            console.error("Login Error:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: 'Refresh token missing' });
                return;
            }
            // Verify the refresh token using JwtUtility
            let decoded: string | JwtPayload;
            try {
                decoded = JwtUtility.verifyToken(refreshToken, true);
            } catch (err) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: 'Invalid refresh token' });
                return
            }
            const { role, userId } = decoded as TokenPayload;
            if (!userId || !role) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Invalid token payload' });
                return
            }
            const newAccessToken = JwtUtility.generateAccessToken({ userId, role });
            res.cookie("accessToken", newAccessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
            res.status(STATUS_CODES.OK).json({ status: true, accessToken: newAccessToken, message: "Access token refreshed successfully" });
        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Internal server error' });
        }
    };

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { fullName, email, profilePicture } = req.body;
            if (!fullName || !email || !profilePicture) {
                console.warn("Missing Google credentials");
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "name, email, and image are required.", });
                return
            }
            let currentUser = await this.userService.findUser(email);
            if (!currentUser) {
                currentUser = await this.userService.registerUser({ fullName, email, profilePicture } as IUserType);
                if (!currentUser) {
                    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create user.", });
                    return
                }
            } else if (!currentUser?.isActive) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: 'User is blocked by admin', });
                return;
            }
            const payload = { userId: (currentUser._id as string).toString(), role: "user" };
            const accessToken = JwtUtility.generateAccessToken(payload);
            const refreshToken = JwtUtility.generateRefreshToken(payload);
            res.cookie("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: 24 * 60 * 1000, });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, });
            res.status(STATUS_CODES.OK).json({
                status: true, message: "Login successful", accessToken,
                data: {
                    accessToken,
                    user: {
                        id: currentUser._id,
                        email: currentUser.email,
                        name: currentUser.fullName,
                        role: "user"
                    }
                }
            });
        } catch (error) {
            console.error("Error during Google auth:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            return
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

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        try {
            const currentUser = await this.userService.findUser(email);
            if (!currentUser) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "Email is not registered." });
                return;
            }
            const response = await this.userService.findOtp(email);
            const storedOTP = response?.otp;
            if (!storedOTP) {
                const otp = await OtpUtility.otpGenerator();
                await MailUtility.sendMail(email, otp, "Verification otp");
                res.status(STATUS_CODES.OK).json({ status: true, message: "Otp sent to the given mail id", email, otp });
                await this.userService.storeOtp(email, otp);
            } else {
                await MailUtility.sendMail(email, Number(storedOTP), "Verification otp");
                res.status(STATUS_CODES.OK).json({ status: true, message: "Otp sent to the given mail id", email, storedOTP, });
                await this.userService.storeResendOtp(email, Number(storedOTP));
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        try {
            const currentUser = await this.userService.findUser(email);
            if (!currentUser) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "Email is not registered." });
                return;
            }
            const updateUser = await this.userService.resetPassword(email, password);
            if (updateUser) {
                res.status(STATUS_CODES.OK).json({ status: true, message: "Password Change successfully" });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Password change failed" });
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, });
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const id = req.userId
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            const userDetails = await this.userService.getUserById(id)
            if (!userDetails) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            if (userDetails.isActive) {
                res.status(STATUS_CODES.OK).json({ status: true, message: "Data retrieved successfully", userDetails });
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
            const { id, fullName, phoneNumber, newPassword, profilePicture } = req.body;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User ID is required', });
                return;
            }
            const user = await this.userService.getUserById(id);
            if (!user) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User not found', });
                return;
            }
            if (!user.isActive) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: 'User is blocked by admin', });
                return;
            }
            const updateData: any = {};
            if (fullName) updateData.fullName = fullName;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (newPassword) updateData.password = newPassword;
            if (profilePicture) updateData.profilePicture = profilePicture;
            const updatedUser = await this.userService.updateUserById(id, updateData);
            res.status(STATUS_CODES.OK).json({ status: true, message: 'Profile updated successfully', userDetails: updatedUser, });
        } catch (error) {
            console.error('Update Profile Error:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Failed to update profile', });
        }
    }

    async fetchPlans(req: Request, res: Response): Promise<void> {
        try {
            const planData = await this.userService.fetchPlans();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Subscription plan Fetched Successfully", planData })
        } catch (error) {
            console.error("Failed to fetch Subscription plan", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Subscription plan", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async getAllExpert(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.userService.getAllExpert();
            const expert = response || [];
            const formattedExperts = expert.map((expert: any) => ({
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
        } catch (error) {
            console.error("Get experts error:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to fetch experts", });
        }
    };

    async getExpertById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
                return;
            }
            const Expert = await this.userService.getExpertById(id)
            if (!Expert) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            res.status(STATUS_CODES.OK).json({ status: true, message: "Expert details fetched successfully", Expert });
        } catch (error) {
            console.error("Get expert Details error:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, error: "Get expert Details error", });
        }
    };
}


export default UserController;