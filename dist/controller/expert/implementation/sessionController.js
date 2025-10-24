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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class SessionController {
    constructor(sessionService) {
        this.getSlots = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const expertId = req.userId;
            if (!expertId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EXPERT_ID_MISSING, });
                return;
            }
            const slots = yield this._sessionService.getSlots(expertId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Session slot Fetched Successfully", slots });
        }));
        this.addSlot = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const sessionData = Object.assign(Object.assign({}, req.body), { expertId: req.userId });
            const newSession = yield this._sessionService.addSlot(sessionData);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Session slot created Successfully", newSession });
        }));
        this.editSlot = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { _id } = _a, sessionData = __rest(_a, ["_id"]);
            const updatedSlot = yield this._sessionService.editSlot(_id, sessionData);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Session slot edited Successfully", updatedSlot });
        }));
        this.deleteSlot = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const deleted = yield this._sessionService.deleteSlot(id);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Session slot deleted Successfully", deleted });
        }));
        this.getDashboardStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const expertId = req.userId;
            if (!expertId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EXPERT_ID_MISSING });
                return;
            }
            const stats = yield this._sessionService.getDashboardStats(expertId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'fetch dashboard stats', stats });
        }));
        this.getSessionAnalytics = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const expertId = req.userId;
            if (!expertId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.EXPERT_ID_MISSING });
                return;
            }
            const { period = '30d' } = req.query;
            const analytics = yield this._sessionService.getSessionAnalytics(expertId, period);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: 'fetch session analytics', analytics });
        }));
        this.getSessions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
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
            const result = yield this._sessionService.getSessions(expertId, page, limit, filters);
            res.status(statusCode_1.STATUS_CODES.OK).json(Object.assign({ status: true }, result));
        }));
        this._sessionService = sessionService;
    }
}
exports.default = SessionController;
