import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import JwtUtility, { TokenPayload } from "../../../utils/JwtUtility"
import { ERROR_MESSAGES } from "../../../constants/message";
import { STATUS_CODES } from "../../../constants/statusCode";

import IAdminController from "../IAdminController";
import IAdminService from "../../../service/admin/IAdminService";
// import IAdminService from "../../../service/admin/IAdminService"

dotenv.config();

class AdminController implements IAdminController {

    private adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this.adminService = adminService;
    }

    async adminLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.BAD_REQUEST, data: null })
            }

            const isAdmin = process.env.ADMIN_USERNAME === email && process.env.ADMIN_PASSWORD === password;
            if (!isAdmin) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED, data: null });
                return
            }

            const payload: TokenPayload = { userId: email, role: "admin" };
            const accessToken = JwtUtility.generateAccessToken(payload);
            const refreshToken = JwtUtility.generateRefreshToken(payload);
            res.cookie("admin-accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: 24 * 60 * 1000, });
            res.cookie("admin-refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 2 * 24 * 60 * 60 * 1000, });

            res.status(STATUS_CODES.OK).json({
                success: true, message: "login successful",
                data: {
                    accessToken,
                    user: { id: email, role: "admin" },
                },
            });

        } catch (error) {
            console.error("Error during signup:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }


    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie("admin-accessToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.clearCookie("admin-refreshToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.status(STATUS_CODES.OK).json({ status: true, message: "Logout successful", });
            return
        } catch (error) {
            console.error("Logout error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ error: "logout failed" });
            return
        }
    }


    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.adminService.getUsers();
            const users = response?.users || [];

            const formattedUsers = users.map((user: any) => ({
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                isActive: user.isActive,
                createdAt: user.createdAt
            }));

            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Users fetched successfully",
                data: {
                    users: formattedUsers,
                    userCount: response.total
                },
            });
        } catch (error) {
            console.error("Get users error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                error: "Failed to fetch users",
            });
        }
    }


    async userStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!id || status === undefined) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
                return;
            }

            const checkUser = await this.adminService.getUserById(id)
            if (!checkUser) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    status: false,
                    message: ERROR_MESSAGES.USER_NOT_FOUND
                })
                return
            }

            await this.adminService.userUpdateStatus(id, status)
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Users status change successfully",
            });
        } catch (error) {
            console.error("Get users error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                error: "Failed to Change Status",
            });
        }
    }


    async getExperts(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.adminService.getExperts();
            const expert = response?.experts || [];

            const formattedExperts = expert.map((expert: any) => ({
                id: expert._id,
                email: expert.email,
                fullName: expert.fullName,
                phoneNumber: expert.phoneNumber,
                isActive: expert.isActive,
                isVerified: expert.isVerified,
                createdAt: expert.createdAt
            }));

            res.status(STATUS_CODES.OK).json({
                status: true,
                message: "Experts fetched successfully",
                data: {
                    experts: formattedExperts,
                    expertCount: response.total
                },
            });
        } catch (error) {
            console.error("Get experts error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                error: "Failed to fetch experts",
            });
        }
    }


    async expertStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!id || status === undefined) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
                return;
            }

            const checkExpert = await this.adminService.getExpertById(id)
            if (!checkExpert) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    status: false,
                    message: ERROR_MESSAGES.USER_NOT_FOUND
                })
                return
            }

            await this.adminService.expertUpdateStatus(id, status)
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Expert status change successfully",
            });
        } catch (error) {
            console.error("Get users error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                error: "Failed to Change Status",
            });
        }
    }


    async expertDetail(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
                return;
            }

            const Expert = await this.adminService.getExpertById(id)
            if (!Expert) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    status: false,
                    message: ERROR_MESSAGES.USER_NOT_FOUND
                })
                return
            }

            res.status(STATUS_CODES.OK).json({ status: true, Expert, message: "Expert details fetched successfully", });
        } catch (error) {
            console.error("Get expert Details error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                status: false,
                error: "Get expert Details error",
            });
        }
    }

    async approveExpert(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            console.log(id)
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return;
            }
            const Expert = await this.adminService.approveExpert(id)
            console.log("result", Expert)
            if (!Expert) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            res.status(STATUS_CODES.OK).json({ status: true, message: "Expert approved successfully" })
        } catch (error) {
            console.error("Expert approve is failed", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                status: false,
                error: "Expert Approve is failed",
            });
        }
    }

    async declineExpert(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return;
            }
            const Expert = await this.adminService.declineExpert(id)
            if (!Expert) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            res.status(STATUS_CODES.OK).json({ status: true, message: "Expert Declined successfully" })
        } catch (error) {
            console.error("Expert decline is failed", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                status: false,
                error: "Expert decline is failed",
            });
        }
    }
}

export default AdminController