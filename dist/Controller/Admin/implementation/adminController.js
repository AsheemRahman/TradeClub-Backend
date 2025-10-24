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
const dotenv_1 = __importDefault(require("dotenv"));
const JwtUtility_1 = __importDefault(require("../../../utils/JwtUtility"));
const errorMessage_1 = require("../../../constants/errorMessage");
const statusCode_1 = require("../../../constants/statusCode");
const mailUtility_1 = __importDefault(require("../../../utils/mailUtility"));
const role_1 = require("../../../constants/role");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const successMessage_1 = require("../../../constants/successMessage");
dotenv_1.default.config();
class AdminController {
    constructor(adminService) {
        this.adminLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.BAD_REQUEST, data: null });
            }
            const isAdmin = process.env.ADMIN_USERNAME === email && process.env.ADMIN_PASSWORD === password;
            if (!isAdmin) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_CREDENTIALS });
                return;
            }
            const payload = { userId: email, role: role_1.ROLE.ADMIN };
            const accessToken = JwtUtility_1.default.generateAccessToken(payload);
            const refreshToken = JwtUtility_1.default.generateRefreshToken(payload);
            res.cookie("admin-accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
            res.cookie("admin-refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: parseInt(process.env.ADMIN_REFRESH_TOKEN_MAX_AGE || "86400000") });
            res.status(statusCode_1.STATUS_CODES.OK).json({
                success: true, message: successMessage_1.SUCCESS_MESSAGES.LOGIN,
                data: {
                    accessToken,
                    user: { id: email, role: role_1.ROLE.ADMIN },
                },
            });
        }));
        this.refreshToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies['admin-refreshToken'];
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
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN });
                return;
            }
            const { role, userId } = decoded;
            if (!userId || !role) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Invalid token payload' });
                return;
            }
            const newAccessToken = JwtUtility_1.default.generateAccessToken({ userId, role });
            res.cookie("admin-accessToken", newAccessToken, { httpOnly: false, secure: true, sameSite: "none", maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "1440000") });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, accessToken: newAccessToken, message: "Access token refreshed successfully" });
        }));
        this.logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("admin-accessToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.clearCookie("admin-refreshToken", { httpOnly: true, secure: true, sameSite: "none", });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.LOGOUT });
            return;
        }));
        this.getUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { search = "", status, sort = "createdAt", page = "1", limit = "10" } = req.query;
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const response = yield this._adminService.getUsers({
                search: search,
                status: status,
                sort: sort,
                page: pageNumber,
                limit: limitNumber
            });
            const users = (response === null || response === void 0 ? void 0 : response.users) || [];
            const formattedUsers = users.map((user) => ({
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                isActive: user.isActive,
                createdAt: user.createdAt,
            }));
            res.status(statusCode_1.STATUS_CODES.OK).json({
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
        }));
        this.getUserById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const user = yield this._adminService.getUserById(id);
            if (!user) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH, user });
        }));
        this.userStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            if (!id || status === undefined) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
                return;
            }
            const checkUser = yield this._adminService.getUserById(id);
            if (!checkUser) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({
                    status: false,
                    message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND
                });
                return;
            }
            yield this._adminService.userUpdateStatus(id, status);
            res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Users status change successfully", });
        }));
        this.getExperts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { search = "", page = "1", limit = "10" } = req.query;
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const response = yield this._adminService.getExperts({
                search: search,
                page: pageNumber,
                limit: limitNumber
            });
            const expert = (response === null || response === void 0 ? void 0 : response.experts) || [];
            const formattedExperts = expert.map((expert) => ({
                id: expert._id,
                email: expert.email,
                fullName: expert.fullName,
                phoneNumber: expert.phoneNumber,
                isActive: expert.isActive,
                isVerified: expert.isVerified,
                createdAt: expert.createdAt
            }));
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true, message: "Experts fetched successfully",
                experts: formattedExperts,
                pagination: {
                    total: response.total,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(response.total / limitNumber),
                },
            });
        }));
        this.expertStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            if (!id || status === undefined) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
                return;
            }
            const checkExpert = yield this._adminService.getExpertById(id);
            if (!checkExpert) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            yield this._adminService.expertUpdateStatus(id, status);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Expert status change successfully", });
        }));
        this.expertDetail = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
                return;
            }
            const Expert = yield this._adminService.getExpertById(id);
            if (!Expert) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, Expert, message: "Expert details fetched successfully", });
        }));
        this.approveExpert = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const Expert = yield this._adminService.approveExpert(id);
            if (!Expert) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            yield mailUtility_1.default.sendApprovalMail(Expert.email, Expert.fullName || 'Expert', "Congratulations! Your Expert Application has been Approved - TradeClub");
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Expert approved successfully and welcome email sent" });
        }));
        this.declineExpert = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, rejectionReason } = req.body;
            if (!id || !rejectionReason) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const Expert = yield this._adminService.declineExpert(id);
            if (!Expert) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            yield mailUtility_1.default.sendRejectionMail(Expert.email, Expert.fullName || 'Expert', rejectionReason, "Application Declined - TradeClub");
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Expert declined successfully and notification email sent" });
        }));
        this.getOrders = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = "1", limit = "10", status = "all", type = "all", search = "", sortBy = "createdAt", sortOrder = "desc", } = req.query;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const { orders, total } = yield this._adminService.getOrders({
                page: pageNum,
                limit: limitNum,
                status: status,
                type: type,
                search: search,
                sortBy: sortBy,
                sortOrder: sortOrder,
            });
            // Compute stats
            const stats = {
                total: total,
                paid: orders.filter(o => o.paymentStatus === 'paid').length,
                pending: orders.filter(o => o.paymentStatus === 'pending').length,
                failed: orders.filter(o => o.paymentStatus === 'failed').length,
                totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.amount, 0),
            };
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true,
                message: "Orders fetched successfully",
                orders,
                stats,
                total,
                page: pageNum,
                totalPages: Math.ceil(total / limitNum),
            });
        }));
        this.getRevenue = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // Fetch only paid orders
            const orders = yield this._adminService.getPaidOrders();
            if (!orders || orders.length === 0) {
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, revenue: [] });
                return;
            }
            const revenueByMonth = {};
            orders.forEach((order) => {
                const date = new Date(order.createdAt);
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
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Revenue data fetched successfully", revenue: revenueData, });
        }));
        this.getStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const stats = yield this._adminService.getStats();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Dashboard data fetched successfully", totalCustomers: stats.totalCustomers, totalExperts: stats.totalExperts });
        }));
        this._adminService = adminService;
    }
}
exports.default = AdminController;
