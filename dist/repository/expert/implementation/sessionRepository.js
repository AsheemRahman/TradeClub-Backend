"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../base/implementation/baseRepository");
const availabilitySchema_1 = require("../../../model/expert/availabilitySchema");
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema_1 = require("../../../model/expert/sessionSchema");
class SessionRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(sessionSchema_1.Session);
    }
    async getAllByExpertId(expertId) {
        return await availabilitySchema_1.ExpertAvailability.find({ expertId });
    }
    async addSession(sessionData) {
        const session = new availabilitySchema_1.ExpertAvailability(sessionData);
        return await session.save();
    }
    async updateSession(sessionId, updatedData) {
        return await availabilitySchema_1.ExpertAvailability.findByIdAndUpdate(sessionId, updatedData, { new: true });
    }
    async deleteSession(sessionId) {
        return await availabilitySchema_1.ExpertAvailability.findByIdAndDelete(sessionId);
    }
    //-------------------------------- Dashboard ---------------------------------
    async countSessionsByExpert(expertId) {
        return this.model.countDocuments({ expertId: new mongoose_1.default.Types.ObjectId(expertId) });
    }
    async countCompletedSessions(expertId) {
        return this.model.countDocuments({ expertId: expertId, status: 'completed' });
    }
    async getDistinctStudents(expertId) {
        return this.model.distinct('userId', { expertId });
    }
    async getRecentStudents(expertId, lastMonth) {
        return this.model.distinct('userId', { expertId: expertId, date: { $gte: lastMonth } });
    }
    async getUpcomingSessions(expertId) {
        return this.model.countDocuments({ expertId: expertId, status: 'upcoming' });
    }
    async getSessionAnalytics(expertId, startDate) {
        return this.model.aggregate([
            { $match: { expertId: new mongoose_1.default.Types.ObjectId(expertId), bookedAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$bookedAt' } },
                    sessions: { $sum: 1 },
                    students: { $addToSet: '$userId' }
                }
            }, { $sort: { _id: 1 } }
        ]);
    }
    async findSessions(query, page, limit) {
        return sessionSchema_1.Session.find(query)
            .populate('userId', 'fullName email profilePicture')
            .populate('expertId', 'fullName')
            .populate('availabilityId', 'startTime endTime date')
            .sort({ 'availabilityId.startTime': -1 })
            .limit(limit)
            .skip((page - 1) * limit);
    }
    async countSessions(query) {
        return this.model.countDocuments(query);
    }
}
exports.default = SessionRepository;
//# sourceMappingURL=sessionRepository.js.map