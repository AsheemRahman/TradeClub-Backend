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
Object.defineProperty(exports, "__esModule", { value: true });
class SessionService {
    constructor(sessionRepository) {
        this._sessionRepository = sessionRepository;
    }
    ;
    getSlots(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._sessionRepository.getAllByExpertId(expertId);
        });
    }
    ;
    addSlot(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._sessionRepository.addSession(sessionData);
        });
    }
    ;
    editSlot(slotId, sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._sessionRepository.updateSession(slotId, sessionData);
        });
    }
    ;
    deleteSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._sessionRepository.deleteSession(slotId);
        });
    }
    ;
    getDashboardStats(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const lastMonth = new Date();
            lastMonth.setDate(lastMonth.getDate() - 30);
            const [distinctStudents, totalSessions, upcomingSessions, completedSessions, recentStudents] = yield Promise.all([
                this._sessionRepository.getDistinctStudents(expertId),
                this._sessionRepository.countSessionsByExpert(expertId),
                this._sessionRepository.getUpcomingSessions(expertId),
                this._sessionRepository.countCompletedSessions(expertId),
                this._sessionRepository.getRecentStudents(expertId, lastMonth)
            ]);
            const totalStudents = distinctStudents.length;
            const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
            const monthlyGrowth = totalStudents > 0 ? Math.round((((_a = recentStudents === null || recentStudents === void 0 ? void 0 : recentStudents.length) !== null && _a !== void 0 ? _a : 0) / totalStudents) * 100) : 0;
            return {
                totalStudents,
                totalSessions,
                upcomingSessions,
                completionRate,
                monthlyGrowth,
            };
        });
    }
    getSessionAnalytics(expertId, period) {
        return __awaiter(this, void 0, void 0, function* () {
            const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const analytics = yield this._sessionRepository.getSessionAnalytics(expertId, startDate);
            return analytics.map((data) => ({
                date: data._id,
                sessions: data.sessions,
                students: data.students.length
            }));
        });
    }
    getSessions(expertId, page, limit, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, date, startDate, endDate, search } = filters;
            const query = { expertId };
            if (status && status !== 'all')
                query.status = status;
            if (date) {
                const startOfDay = new Date(date);
                const endOfDay = new Date(startOfDay);
                endOfDay.setDate(endOfDay.getDate() + 1);
                query['availabilityId.startTime'] = { $gte: startOfDay, $lt: endOfDay };
            }
            else if (startDate && endDate) {
                query['availabilityId.startTime'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
            }
            if (search) {
                query.$or = [
                    { 'userId.fullName': { $regex: search, $options: 'i' } },
                    { 'userId.email': { $regex: search, $options: 'i' } }
                ];
            }
            const sessions = yield this._sessionRepository.findSessions(query, page, limit);
            const total = yield this._sessionRepository.countSessions(query);
            return {
                sessions,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1,
                },
            };
        });
    }
}
exports.default = SessionService;
