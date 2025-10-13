import { Request, Response } from "express";
import dotenv from 'dotenv';

import JwtUtility, { TokenPayload } from "../../../utils/JwtUtility"
import { ERROR_MESSAGES } from "../../../constants/errorMessage";
import { STATUS_CODES } from "../../../constants/statusCode";

import IAdminController from "../IAdminController";
import IAdminService from "../../../service/admin/IAdminService";
import MailUtility from "../../../utils/mailUtility";
import { JwtPayload } from "jsonwebtoken";
import { ROLE } from "../../../constants/role";
import { asyncHandler } from "../../../utils/asyncHandler";
import { SUCCESS_MESSAGES } from "../../../constants/successMessage";


dotenv.config();

class AdminController implements IAdminController {

    private _adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this._adminService = adminService;
    }

    adminLogin = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.BAD_REQUEST, data: null })
        }
        const isAdmin = process.env.ADMIN_USERNAME === email && process.env.ADMIN_PASSWORD === password;
        if (!isAdmin) {
            res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS });
            return
        }
        const payload: TokenPayload = { userId: email, role: ROLE.ADMIN };
        const accessToken = JwtUtility.generateAccessToken(payload);
        const refreshToken = JwtUtility.generateRefreshToken(payload);
        res.cookie("admin-accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
        res.cookie("admin-refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: parseInt(process.env.ADMIN_REFRESH_TOKEN_MAX_AGE || "86400000") });
        res.status(STATUS_CODES.OK).json({
            success: true, message: SUCCESS_MESSAGES.LOGIN,
            data: {
                accessToken,
                user: { id: email, role: ROLE.ADMIN },
            },
        });
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies['admin-refreshToken'];
        if (!refreshToken) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING });
            return;
        }
        // Verify the refresh token using JwtUtility
        let decoded: string | JwtPayload;
        try {
            decoded = JwtUtility.verifyToken(refreshToken, true);
        } catch (err) {
            res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: ERROR_MESSAGES.INVALID_REFRESH_TOKEN });
            return
        }
        const { role, userId } = decoded as TokenPayload;
        if (!userId || !role) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Invalid token payload' });
            return
        }
        const newAccessToken = JwtUtility.generateAccessToken({ userId, role });
        res.cookie("admin-accessToken", newAccessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
        res.status(STATUS_CODES.OK).json({ status: true, accessToken: newAccessToken, message: "Access token refreshed successfully" });
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        res.clearCookie("admin-accessToken", { httpOnly: true, secure: true, sameSite: "none", });
        res.clearCookie("admin-refreshToken", { httpOnly: true, secure: true, sameSite: "none", });
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.LOGOUT });
        return
    });


    getUsers = asyncHandler(async (req: Request, res: Response) => {
        const { search = "", status, sort = "createdAt", page = "1", limit = "10" } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const response = await this._adminService.getUsers({
            search: search as string,
            status: status as string,
            sort: sort as string,
            page: pageNumber,
            limit: limitNumber
        });
        const users = response?.users || [];
        const formattedUsers = users.map((user) => ({
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            isActive: user.isActive,
            createdAt: user.createdAt,
        }));
        res.status(STATUS_CODES.OK).json({
            status: true,
            message: "Users fetched successfully",
            users: formattedUsers,
            pagination: {
                total: response.total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(response.total / limitNumber),
            },
        });
    });

    getUserById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const user = await this._adminService.getUserById(id)
        if (!user) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.COURSE_FETCH, user })
    });

    userStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || status === undefined) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
            return;
        }
        const checkUser = await this._adminService.getUserById(id)
        if (!checkUser) {
            res.status(STATUS_CODES.BAD_REQUEST).json({
                status: false,
                message: ERROR_MESSAGES.USER_NOT_FOUND
            })
            return
        }
        await this._adminService.userUpdateStatus(id, status)
        res.status(STATUS_CODES.OK).json({ success: true, message: "Users status change successfully", });
    });

    getExperts = asyncHandler(async (req: Request, res: Response) => {
        const { search = "", page = "1", limit = "10" } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const response = await this._adminService.getExperts({
            search: search as string,
            page: pageNumber,
            limit: limitNumber
        });
        const expert = response?.experts || [];
        const formattedExperts = expert.map((expert) => ({
            id: expert._id,
            email: expert.email,
            fullName: expert.fullName,
            phoneNumber: expert.phoneNumber,
            isActive: expert.isActive,
            isVerified: expert.isVerified,
            createdAt: expert.createdAt
        }));
        res.status(STATUS_CODES.OK).json({
            status: true, message: "Experts fetched successfully",
            experts: formattedExperts,
            pagination: {
                total: response.total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(response.total / limitNumber),
            },
        });
    });


    expertStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || status === undefined) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
            return;
        }
        const checkExpert = await this._adminService.getExpertById(id)
        if (!checkExpert) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        await this._adminService.expertUpdateStatus(id, status)
        res.status(STATUS_CODES.OK).json({ status: true, message: "Expert status change successfully", });
    });

    expertDetail = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
            return;
        }
        const Expert = await this._adminService.getExpertById(id)
        if (!Expert) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        res.status(STATUS_CODES.OK).json({ status: true, Expert, message: "Expert details fetched successfully", });
    });

    approveExpert = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.body;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const Expert = await this._adminService.approveExpert(id)
        if (!Expert) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        await MailUtility.sendApprovalMail(Expert.email, Expert.fullName || 'Expert', "Congratulations! Your Expert Application has been Approved - TradeClub");
        res.status(STATUS_CODES.OK).json({ status: true, message: "Expert approved successfully and welcome email sent" })
    });

    declineExpert = asyncHandler(async (req: Request, res: Response) => {
        const { id, rejectionReason } = req.body;
        if (!id || !rejectionReason) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const Expert = await this._adminService.declineExpert(id)
        if (!Expert) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        await MailUtility.sendRejectionMail(Expert.email, Expert.fullName || 'Expert', rejectionReason, "Application Declined - TradeClub");
        res.status(STATUS_CODES.OK).json({ status: true, message: "Expert declined successfully and notification email sent" })
    });

    getOrders = asyncHandler(async (req: Request, res: Response) => {
        const { page = "1", limit = "10", status = "all", type = "all", search = "", sortBy = "createdAt", sortOrder = "desc", } = req.query
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const { orders, total } = await this._adminService.getOrders({
            page: pageNum,
            limit: limitNum,
            status: status as string,
            type: type as string,
            search: search as string,
            sortBy: sortBy as string,
            sortOrder: sortOrder as string,
        });
        // Compute stats
        const stats = {
            total: total,
            paid: orders.filter(o => o.paymentStatus === 'paid').length,
            pending: orders.filter(o => o.paymentStatus === 'pending').length,
            failed: orders.filter(o => o.paymentStatus === 'failed').length,
            totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.amount, 0),
        };
        res.status(STATUS_CODES.OK).json({
            status: true,
            message: "Orders fetched successfully",
            orders,
            stats,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        });
    });

    getRevenue = asyncHandler(async (req: Request, res: Response) => {
        // Fetch only paid orders
        const orders = await this._adminService.getPaidOrders();
        if (!orders || orders.length === 0) {
            res.status(STATUS_CODES.OK).json({ status: true, revenue: [] });
            return;
        }
        const revenueByMonth: Record<string, { revenue: number; customers: number }> = {};
        orders.forEach((order) => {
            const date = new Date(order.createdAt!);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!revenueByMonth[month]) {
                revenueByMonth[month] = { revenue: 0, customers: 0 };
            }
            revenueByMonth[month].revenue += order.amount;
            revenueByMonth[month].customers += 1;
        });
        const revenueData = Object.keys(revenueByMonth).map((month) => ({
            month,
            revenue: revenueByMonth[month].revenue,
            customers: revenueByMonth[month].customers,
        }));
        res.status(STATUS_CODES.OK).json({ status: true, message: "Revenue data fetched successfully", revenue: revenueData, });
    });

    getStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await this._adminService.getStats();
        res.status(STATUS_CODES.OK).json({ status: true, message: "Dashboard data fetched successfully", totalCustomers : stats.totalCustomers, totalExperts : stats.totalExperts });
    });


}

export default AdminController;