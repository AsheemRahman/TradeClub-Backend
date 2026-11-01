"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class SessionController {
    _sessionService;
    constructor(sessionService) {
        this._sessionService = sessionService;
    }
    getSlots = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const expertId = req.userId;
        if (!expertId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EXPERT_ID_MISSING, });
            return;
        }
        const slots = await this._sessionService.getSlots(expertId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Session slot Fetched Successfully", slots });
    });
    addSlot = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const sessionData = { ...req.body, expertId: req.userId };
        const newSession = await this._sessionService.addSlot(sessionData);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Session slot created Successfully", newSession });
    });
    editSlot = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { _id, ...sessionData } = req.body;
        const updatedSlot = await this._sessionService.editSlot(_id, sessionData);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Session slot edited Successfully", updatedSlot });
    });
    deleteSlot = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const deleted = await this._sessionService.deleteSlot(id);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Session slot deleted Successfully", deleted });
    });
    getDashboardStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const expertId = req.userId;
        if (!expertId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EXPERT_ID_MISSING });
            return;
        }
        const stats = await this._sessionService.getDashboardStats(expertId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'fetch dashboard stats', stats });
    });
    getSessionAnalytics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const expertId = req.userId;
        if (!expertId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EXPERT_ID_MISSING });
            return;
        }
        const { period = '30d' } = req.query;
        const analytics = await this._sessionService.getSessionAnalytics(expertId, period);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'fetch session analytics', analytics });
    });
    getSessions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const expertId = req.userId;
        const { status, date, startDate, endDate, search } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        if (!expertId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EXPERT_ID_MISSING });
            return;
        }
        const filters = {
            status: status,
            date: date,
            startDate: startDate,
            endDate: endDate,
            search: search,
        };
        const result = await this._sessionService.getSessions(expertId, page, limit, filters);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, ...result });
    });
}
exports.default = SessionController;
//# sourceMappingURL=sessionController.js.map