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
const baseRepository_1 = require("../../base/implementation/baseRepository");
const availabilitySchema_1 = require("../../../model/expert/availabilitySchema");
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema_1 = require("../../../model/expert/sessionSchema");
class SessionRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(sessionSchema_1.Session);
    }
    getAllByExpertId(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield availabilitySchema_1.ExpertAvailability.find({ expertId });
        });
    }
    addSession(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = new availabilitySchema_1.ExpertAvailability(sessionData);
            return yield session.save();
        });
    }
    updateSession(sessionId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield availabilitySchema_1.ExpertAvailability.findByIdAndUpdate(sessionId, updatedData, { new: true });
        });
    }
    deleteSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield availabilitySchema_1.ExpertAvailability.findByIdAndDelete(sessionId);
        });
    }
    //-------------------------------- Dashboard ---------------------------------
    countSessionsByExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments({ expertId: new mongoose_1.default.Types.ObjectId(expertId) });
        });
    }
    countCompletedSessions(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments({ expertId: expertId, status: 'completed' });
        });
    }
    getDistinctStudents(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.distinct('userId', { expertId });
        });
    }
    getRecentStudents(expertId, lastMonth) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.distinct('userId', { expertId: expertId, date: { $gte: lastMonth } });
        });
    }
    getUpcomingSessions(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments({ expertId: expertId, status: 'upcoming' });
        });
    }
    getSessionAnalytics(expertId, startDate) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    findSessions(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return sessionSchema_1.Session.find(query)
                .populate('userId', 'fullName email profilePicture')
                .populate('expertId', 'fullName')
                .populate('availabilityId', 'startTime endTime date')
                .sort({ 'availabilityId.startTime': -1 })
                .limit(limit)
                .skip((page - 1) * limit);
        });
    }
    countSessions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments(query);
        });
    }
}
exports.default = SessionRepository;
